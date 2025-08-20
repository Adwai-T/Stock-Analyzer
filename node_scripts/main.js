import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { formatDateForKiteString } from "./utils/helpers.mjs";
import { getHistoricalChartData } from "./kite_connect/historical.mjs";
import { Icons } from "./utils/icons.mjs";

const app = express();
app.use(express.json());
const port = 3000;

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// HTML route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/history", async (req, res) => {
  try {
    console.log(`${Icons.info}  REQUEST`, req.body);
    const { symbol, startDateString, endDateString, interval } = req.body;

    if (!symbol) {
      return res
        .status(400)
        .json({ error: `${Icons.error}Missing required fields in body.` });
    }

    let defaultStartDate = new Date();
    defaultStartDate.setFullYear(2020);
    let startDate = startDateString
      ? formatDateForKiteString(new Date(startDateString))
      : formatDateForKiteString(defaultStartDate);

    let defaultEndDate = new Date();
    const endDate = endDateString
      ? formatDateForKiteString(new Date(endDateString))
      : formatDateForKiteString(defaultEndDate);

    let defaultInterval = "day";
    let inter = interval ? interval : defaultInterval;

    await getHistoricalChartData(symbol, startDate, endDate, inter);
    let csvString = fs.readFileSync(`data/${symbol}.csv`, "utf-8");
    const csv = csvString ? csvString : undefined;

    if (!csv)
      return res
        .status(400)
        .json({
          error: `${Icons.error}Could not load csv file for the company - ${symbol}`,
        });

    res.send(csv);
  } catch (error) {
    return res
      .status(400)
      .json({
        error: `${Icons.error}Something went wrong while fetching - ${error}`,
      });
  }
});

app.get("/history/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    console.log(`${Icons.rocket} symbol - `, symbol);
    let csvString = fs.readFileSync(`data/${symbol}.csv`, "utf-8");
    const csv = csvString ? csvString : undefined;

    if (!csv)
      return res
        .status(400)
        .json({
          error: `${Icons.error}Could not load csv file for the symbol - ${symbol}`,
        });

    res.send(csv);
  } catch (error) {
    return res
      .status(400)
      .json({
        error: `${Icons.error}Error while loading existing file - ${error}`,
      });
  }
});

app.listen(port, () => {
  console.log(`${Icons.rocket} Server running at http://localhost:${port}`);
});
