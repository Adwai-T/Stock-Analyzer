import axios from "axios";
import {
  readFileSync,
  writeFileSync,
  parseCSVtoRows,
} from "../utils/file_helper.mjs";
import { formatDateForKiteString } from "../utils/helpers.mjs";
import { Icons } from "../utils/icons.mjs";

// -- node node_scripts/kite_connect/historical.mjs

// --  Get the company symbol from command-line arguments
const args = process.argv.slice(2); // Skip the first two default args
console.log("Received arguments:", args);

export async function getHistoricalChartData(
  symbol,
  fromDate,
  toDate,
  interval
) {

  console.log('Parameters - ', symbol, fromDate, toDate, interval);

  const CREDS_STRING = readFileSync("savedcreds.json");
  const CREDS = JSON.parse(CREDS_STRING);

  let instrumentToken;
  try {
    instrumentToken = await getInstrumentToken(symbol);
    console.log(
      `${Icons.success}Instrument token found for ${symbol} - ${instrumentToken}`
    );
  } catch (error) {
    console.log(`${Icons.error}Could not find Instrument token for ${symbol}`);
    console.error(`${Icons.error} - ${error}`);
    return;
  }

  if (
    instrumentToken == undefined ||
    instrumentToken == "" ||
    instrumentToken == null
  ) {
    console.log(`${Icons.error}Could not find Instrument token for ${symbol}`);
  }

  const url = `https://api.kite.trade/instruments/historical/${instrumentToken}/${interval}`;
  const params = {
    from: fromDate,
    to: toDate,
    oi: 1, // Include Open Interest data
  };

  const response = await axios.get(url, {
    headers: {
      "X-Kite-Version": "3",
      Authorization: `token ${CREDS.api_key}:${CREDS.access_token}`,
    },
    params,
  });

  const candles = response.data.data.candles;
  processAndSaveInCSV(candles, symbol);
}

/**
 * ['instrument_token','exchange_token','tradingsymbol',
 * 'name','last_price','expiry','strike','tick_size',
 * 'lot_size','instrument_type','segment','exchange']
 * @param {string} symbol
 * @param {string} exchange
 * @param {string} type
 * @returns
 */
export async function getInstrumentToken(
  symbol,
  exchange = "NSE",
  type = "EQ"
) {
  const response = await axios.get("https://api.kite.trade/instruments", {
    responseType: "text",
  });
  const rows = parseCSVtoRows(response.data);
  for (let i = 0; i < rows.length; i++) {
    if (
      rows[i][2] === symbol &&
      rows[i][11] === exchange &&
      rows[i][9] === type
    ) {
      return rows[i][0];
    }
  }
}

// -- array of candle data: [date,open,high,low,close,volume]
export function processAndSaveInCSV(data, symbol) {
  let resultingCSV = "date,open,high,low,close,volume,empty\n";

  if (!data || data?.length == 0)
    return new Error(`${Icons.error}Data not found to convert to csv.`);

  try {
    data.forEach((row) => {
      resultingCSV = resultingCSV.concat(row.join(), "\n");
    });

    writeFileSync(`data/${symbol}.csv`, resultingCSV);
  } catch (error) {
    throw new Error(
      `${Icons.error}Could not complete mapping data to csv format and write to file - ${error}`
    );
  }
}
