import { plotHistoricalData } from "./src/chartTemplates.js";
import { DataFrame } from "./src/data.js";
import { fetchFileAsString } from "./src/helper.js";

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
      let csvString = await fetchFileAsString(`./test-data/${symbol}.csv`);
      //let csvString = await getHistoricalData(symbol);
      let df = new DataFrame(csvString);
      df.printTail();
      df.removeNullEmptyRows();
      df.printTail();
      historicalChart = plotHistoricalData(df, symbol, historicalChart);
      spinner.hidden = true;
    } else {
      errorMessage.innerText = `${Icons.error} No Symbol Entered`;
      console.error("No Symbol Entered");
      errorBox.hidden = false;
      spinner.hidden = true;
    }
  });

// -- EVENT Listerners END

