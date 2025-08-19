async function trainLSTMModel(stockDf) {
  const lookBack = 20;

  // 1. Normalize the data
  const cols = ["open", "high", "low", "close", "volume"];
  let min = {}, max = {};
  cols.forEach(col => {
    min[col] = stockDf[col].min();
    max[col] = stockDf[col].max();
    stockDf[col] = stockDf[col].sub(min[col]).div(max[col] - min[col]);
  });

  // 2. Create input-output sequences
  const X = [], y = [];
  const values = stockDf.values;

  for (let i = 0; i < values.length - lookBack; i++) {
    const inputSeq = values.slice(i, i + lookBack);        // shape: [lookBack, 5]
    const target = values[i + lookBack][3];                // 'close' price
    X.push(inputSeq);
    y.push(target);
  }

  // 3. Convert to tensors
  const xs = tf.tensor3d(X);   // shape: [samples, lookBack, features]
  const ys = tf.tensor2d(y, [y.length, 1]); // shape: [samples, 1]

  // 4. Build the LSTM model
  const model = tf.sequential();
  model.add(tf.layers.lstm({ units: 50, inputShape: [lookBack, cols.length] }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  // 5. Train the model
  await model.fit(xs, ys, {
    epochs: 50,
    batchSize: 32,
    validationSplit: 0.1,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Epoch ${epoch + 1}: loss=${logs.loss.toFixed(4)}, val_loss=${logs.val_loss.toFixed(4)}`);
      }
    }
  });

  return { model, min, max };
}

async function loadAndTrain() {
  const df = await dfd.readCSV("your_stock_data.csv");  // make sure it has date, open, high, low, close, volume
  const { model, min, max } = await trainLSTMModel(df);
  
  // You can now use `model.predict(...)` to predict future prices.
}

function predictNext(model, recentData, min, max) {
  // Normalize recentData using previous min-max
  const norm = recentData.map((row, i) =>
    row.map((val, j) => {
      const col = ["open", "high", "low", "close", "volume"][j];
      return (val - min[col]) / (max[col] - min[col]);
    })
  );

  const input = tf.tensor3d([norm]); // shape: [1, lookBack, 5]
  const pred = model.predict(input);
  const closeNorm = pred.dataSync()[0];

  const denormClose = closeNorm * (max["close"] - min["close"]) + min["close"];
  return denormClose;
}