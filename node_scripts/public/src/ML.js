export async function preProcess(df, labelIndex) {
  df.castColumnsAtIndexToNumber([0, 1, 2, 3, 4]);
  df.removeNullEmptyRows();
  const trainingVariables = tf.tidy(() => {
    const labels = tf.tensor2d(df.removeColumnAtIndex(labelIndex));
    const features = tf.tensor2d(df.data);

    const minLabels = labels.min(0);
    const maxLabels = labels.max(0);

    const minFeatures = features.min(0);
    const maxFeatures = features.max(0);

    //const normLabel = labels.sub(minLabels).div(maxLabels.sub(minLabels));
    const normLabel = normalize(labels, minLabels, maxLabels);
    normLabel.print();

    // const normFeatures = features
    //   .sub(minFeatures)
    //   .div(maxFeatures.sub(minFeatures));
    const normFeatures = normalize(features, minFeatures, maxFeatures);
    normFeatures.print();

    // -- Return tensors that will be used later in predict
    return {
      minFeatures: minFeatures,
      maxFeatures: maxFeatures,
      minLabels: minLabels,
      maxLabels: maxLabels,
      normFeatures: normFeatures,
      normLabel: normLabel,
    };
  });
  console.log("numTensors (outside tidy): " + tf.memory().numTensors);

  return trainingVariables;
}

export function normalize(data, min, max) {
  data.print();
  return data.sub(min).div(max.sub(min));
}

export function denormalize(normalized, min, max) {
  return normalized.mul(max.sub(min)).add(min);
}

export async function trainLR(trainingVariables) {
    trainingVariables.minFeatures.print();
    trainingVariables.maxFeatures.print();

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [4] })); // 4 inputs → 1 output

  // 3. Compile model (optimizer + loss)
  model.compile({
    optimizer: tf.train.sgd(0.01),
    loss: "meanSquaredError",
  });

  await model.fit(trainingVariables.normFeatures, trainingVariables.normLabel, {
    epochs: 200,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 50 === 0) {
          console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
        }
      },
    },
  });

  return model;
}

export async function predict(model, input, trainingVariables) {
  tf.tidy(() => {
    const inputTensor = tf.tensor2d(input);

    const normInput = normalize(
      inputTensor,
      trainingVariables.minFeatures,
      trainingVariables.maxFeatures
    );

    console.log('NORMALIZED INPUT');
    normInput.print();
    console.log('NORMALIZED INPUT');

    const dataOutput = model.predict(normInput);
    dataOutput.print();
    denormalize(dataOutput, trainingVariables.minLabels, trainingVariables.maxLabels).print();
  });
}
