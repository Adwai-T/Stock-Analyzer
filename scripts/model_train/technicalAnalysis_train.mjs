import { loadAndPrepareCSVData } from "./technicalAnalysis_prepareData.mjs";
import * as tf from "@tensorflow/tfjs";

function createSequences(data, featureKeys, sequenceLength = 20) {
  const X = [];
  const y = [];

  for (let i = 0; i < data.length - sequenceLength - 1; i++) {
    const sequence = data
      .slice(i, i + sequenceLength)
      .map((row) => featureKeys.map((key) => row[key]));
    const target = data[i + sequenceLength].close;
    X.push(sequence);
    y.push([target]);
  }

  return {
    X: tf.tensor3d(X), // [samples, timeSteps, features]
    y: tf.tensor2d(y), // [samples, 1]
  };
}

function buildLSTMModel(inputShape) {
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 64, returnSequences: false, inputShape }));
  model.add(tf.layers.dropout({ rate: 0.2 }));
  model.add(tf.layers.dense({ units: 32, activation: "relu" }));
  model.add(tf.layers.dense({ units: 1 })); // predict closing price

  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(),
  });

  return model;
}

async function trainModel(data) {
  const features = [
    "open",
    "high",
    "low",
    "close",
    "volume",
    "sma20",
    "ema20",
    "rsi14",
    "macd",
    "macdSignal",
    "macdHist",
    "bbUpper",
    "bbMiddle",
    "bbLower",
  ];
  const { normalized } = loadAndPrepareCSVData("data/INFY.csv");
  const { X, y } = createSequences(normalized, features, 20);
  const model = buildLSTMModel([20, features.length]);

  const EPOCHS = 50;

  await model.fit(X, y, {
    epochs: EPOCHS,
    batchSize: 32,
    validationSplit: 0.2,
    shuffle: false,
    callbacks: [
      tf.callbacks.earlyStopping({
        monitor: "val_loss",
        patience: 5,
        restoreBestWeight: true,
      })
    ],
  });

  return model;
}

trainModel();

// trainModel(stockData).then(model => {
//   console.log("Model trained.");
// });
