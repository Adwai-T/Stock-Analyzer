import fs from "fs";
import { parseCSVtoRows, writeFileSync } from "../utils/file_helper.mjs";
import {
  extractFeatures,
  normalizeData,
  removeRowsWithNaN
} from "./technicalindicators.mjs";

// -- node scripts/model_train/technicalAnalysis_prepareData.mjs

// Main function to read and prepare CSV
export function loadAndPrepareCSVData(filePath, company) {
  const results = [];
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const rows = parseCSVtoRows(fileContent);
  for (let i = 0; i < rows.length; i++) {
    if (i == 0) continue;
    else {
      if (rows[i][0])
        results.push({
          date: new Date(rows[i][0]),
          open: parseFloat(rows[i][1]),
          high: parseFloat(rows[i][2]),
          low: parseFloat(rows[i][3]),
          close: parseFloat(rows[i][4]),
          volume: parseFloat(rows[i][5]),
        });
    }
  }
  const features_data = extractFeatures(results);
  const cleaned_data = removeRowsWithNaN(features_data);
  const features = ['open','high','low','close','volume',
    'sma20','ema20','rsi14','macd','macdSignal',
    'macdHist','bbUpper','bbMiddle','bbLower'];

  const normalized_cleaned_data = normalizeData(cleaned_data, features);

  writeFileSync(`data/${company}/${company}.json`,JSON.stringify(normalized_cleaned_data.normalized))
  writeFileSync(`data/${company}/${company}_stats.json`,JSON.stringify(normalized_cleaned_data.stats))

  return normalized_cleaned_data
}

// console.log(loadAndPrepareCSVData('data/INFY.csv'));
