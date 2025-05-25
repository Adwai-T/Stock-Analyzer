import csv from "csv-parser";
import axios from "axios";
import { readFileSync, writeFileSync } from "../utils/file_helper.mjs";
import { Icons } from "../utils/icons.mjs";

// -- node scripts/kite_connect/historical.mjs

const startDate = "2024-01-01 09:15:00";
const endDate = "2025-05-21 15:30:00";
const defaultInterval = "day";

export async function getHistoricalChartData(
  symbol,
  fromDate = startDate,
  toDate = endDate,
  interval = defaultInterval
) {
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

export async function getInstrumentToken(
  symbol,
  exchange = "NSE",
  type = "EQ"
) {
  const response = await axios.get("https://api.kite.trade/instruments", {
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(csv())
      .on("data", (row) => {
        if (
          row.tradingsymbol === symbol &&
          row.exchange === exchange &&
          row.instrument_type === type
        ) {
          resolve(row.instrument_token);
        }
      })
      .on("end", () => reject(new Error(`Symbol not found`)));
  });
}

// -- array of candle data: [timestamp, open, high, low, close, volume]
export function processAndSaveInCSV(data, symbol) {
  let resultingCSV = "timestamp, open, high, low, close, volume\n";

  if (!data || data?.length == 0)
    return new Error(`${Icons.error}Data not found to convert to csv.`);

  try {
    data.forEach((row) => {
      resultingCSV = resultingCSV.concat(row.join(), "\n");
    });

    writeFileSync(`data/${symbol}.csv`, resultingCSV);
  } catch (error) {
    throw new Error(`${Icons.error}Could not complete mapping data to csv format and write to file - ${error}`);
  }
}

getHistoricalChartData("INFY");
