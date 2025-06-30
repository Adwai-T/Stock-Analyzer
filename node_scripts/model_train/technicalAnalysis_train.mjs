import { spawn } from 'child_process';
import { loadAndPrepareCSVData } from './technicalAnalysis_prepareData.mjs';

// -- node scripts/model_train/technicalAnalysis_train.mjs

export function trainModel(company) {
  loadAndPrepareCSVData(`./data/${company}/${company}.csv`, company);
  const dataPath = `./data/${company}/${company}.json`;
  const pyPath = './python_scripts/train_lstm_single.py';

  const process = spawn('python', [pyPath, '--data_file', dataPath, '--company', company]);

  process.stdout.on('data', (data) => {
    console.log(data.toString().trim());
  });

  process.stderr.on('data', (data) => {
    console.error(`Error: ${data.toString()}`);
  });

  process.on('close', (code) => {
    if (code === 0) {
      console.log(`✅ Training complete for ${company}`);
    } else {
      console.error(`❌ Training failed with exit code ${code}`);
    }
  });
}

// Example
trainModel("INFY");
