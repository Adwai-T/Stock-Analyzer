const fetchHistoricalDataButtonId = "fetch_historical_data";
const fetchHistoricalDataInputId = "input_symbol";
const historicalDataCanvas = "historicalDataCanvas";
const predictionCanvas = "predictionCanvas";
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById('errorMessage');
const errorBox = document.getElementById('errorBox');

//-- So the charts can be reset when new data is to loaded
let historicalChart;
let predictionChart;

// -- Set values as needed on first loads
function init() {
  errorBox.hidden = true;
  spinner.hidden = true;
}

init();

// -- EVENT Listerners START
const historicalDataEvent = document
  .getElementById(fetchHistoricalDataButtonId)
  .addEventListener("click", async (event) => {
    spinner.hidden = false;
    let symbol = document.getElementById(fetchHistoricalDataInputId).value;
    if (symbol) {
      //let csvString = await getHistoricalDataFromFile(symbol);
      let csvString = await getHistoricalData(symbol);
      let df = await dfReadCSVFromString(csvString);
      plotHistoricalData(df, symbol);
      spinner.hidden = true;
    } else {
      errorMessage.innerText = `${Icons.error} No Symbol Entered`;
      console.error("No Symbol Entered");
      errorBox.hidden = false;
      spinner.hidden = true;
    }
  });

// -- EVENT Listerners END

/**
 * Get fresh Historical Data from Kite
 * @returns
 */
async function getHistoricalData(symbol = "INFY") {
  const body = {
    symbol: symbol,
    startDateString: "2023-01-01",
    endDateString: "2023-12-31",
    interval: "day",
  };

  try {
    const response = await fetch("http://localhost:3000/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      document.getElementById(
        "csvOutput"
      ).textContent = `❌ Error: ${error.error}`;
      return;
    }

    return await response.text();
  } catch (err) {
    document.getElementById(
      "csvOutput"
    ).textContent = `❌ Network error: ${err.message}`;
  }
}

/**
 * Fetch historical Data from file
 * @param {string} symbol Symbol to fetch data for
 */
async function getHistoricalDataFromFile(symbol) {
  let dataString = await fetchFileAsString(`../../data/${symbol}.csv`);
  return dataString;
}

/**
 * Convert the data frame into plotable data format for chartjs
 * Line data [{x:time, y:closeValue}]
 * Bar data [{ c: 28.22, h: 28.52, l: 26.19, o: 27.3, x: 1756462695000 }]
 * @param {dataframe} df
 */
async function plotHistoricalData(df, symbol) {
  df.drop({ columns: ["empty"], inplace: true });
  if (historicalChart) {
    historicalChart.destroy();
  }

  const candleData = df.values.map((row) => {
    return {
      x: new Date(row[0]).getTime(), // convert ISO string to timestamp (ms)
      o: parseFloat(row[1]),
      h: parseFloat(row[2]),
      l: parseFloat(row[3]),
      c: parseFloat(row[4]),
    };
  });

  const ctx = document.getElementById("historicalDataCanvas").getContext("2d");

  historicalChart = new Chart(ctx, {
    type: "candlestick",
    data: {
      datasets: [
        {
          label: `CHRT - ${symbol}`,
          data: candleData,
        },
        // {
        //   label: "Close price",
        //   type: "line",
        //   data: lineData,
        //   hidden: true,
        // },
      ],
    },
    options: {
    plugins: {
      title: {
        display: true,
        text: `Historical Chart - ${symbol}`, // your chart title
        font: {
          size: 18,
          weight: "bold"
        },
        padding: {
          top: 10,
          bottom: 30
        }
      }
    }
  }
  });
}
