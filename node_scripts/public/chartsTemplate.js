/**
 * Convert the data frame into plotable data format for chartjs
 * Line data [{x:time, y:closeValue}]
 * Bar data [{ c: 28.22, h: 28.52, l: 26.19, o: 27.3, x: 1756462695000 }]
 * @param {DataFrame} df 
 * @param {string} symbol 
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