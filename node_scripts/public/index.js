import { plotHistoricalData } from "./src/chartTemplates.js";
import { DataFrame } from "./src/data.js";
import { fetchFileAsString } from "./src/helper.js";
import { predict, preProcess, trainLR } from "./src/ML.js";

const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("errorMessage");
const errorBox = document.getElementById("errorBox");
const historicalDataCanvas = document
  .getElementById("historicalDataCanvas")
  .getContext("2d");

//-- So the charts can be reset when new data is to loaded
let historicalChart;
let predictionChart;

// -- Set values as needed on first loads
function init() {
  errorBox.hidden = true;
  spinner.hidden = true;
}

function cleanUp() {
  tf.engine().reset();
}

init();

// -- EVENT Listerners START
const historicalDataEvent = document
  .getElementById("fetch_historical_data")
  .addEventListener("click", async (event) => {
    spinner.hidden = false;
    let symbol = document.getElementById("input_symbol").value;
    if (symbol) {
      let csvString = await fetchFileAsString(`./test-data/${symbol}.csv`);
      //let csvString = await getHistoricalData(symbol);
      let df = new DataFrame(csvString);
      df.removeNullEmptyRows();
      historicalChart = plotHistoricalData(
        historicalDataCanvas,
        df,
        symbol,
        historicalChart
      );
      spinner.hidden = true;

      // --ML train on fetch
      df.removeColumnAtIndex(0); //--remove dates
      df.removeColumnAtIndex(5); //--remove empty column

      ml(df);

      //cleanUp();
      //console.log('After Cleanup - ' + tf.memory().numTensors);
    } else {
      errorMessage.innerText = `${Icons.error} No Symbol Entered`;
      console.error("No Symbol Entered");
      errorBox.hidden = false;
      spinner.hidden = true;
    }
  });

// -- EVENT Listerners END

async function ml(df) {
  const trainingVariables = await preProcess(df, 3);
  const model = await trainLR(trainingVariables);
  await predict(
    model,
    [[1514, 1526.5, 1504.0500488, 3801140]],
    trainingVariables
  );
}
