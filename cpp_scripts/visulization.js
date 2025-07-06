const ctx1 = document.getElementById("canvas1");
const ctx2 = document.getElementById("canvas2");

main();

async function main() {
  try {
    const datacsvtext = await getFileText("data/stock_data.csv");
    let data = createDatasetForChart(csvToRowsArray(datacsvtext));
    console.log(data);
    data[0].data = data[0].data.map(date => date.slice(0, 10));
    createChart(ctx1, data[0].data, data.slice(4, 5));
  } catch (error) {
    console.error(error);
  }
}

function createChart(ctx, labels, dataset) {
  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: dataset
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

async function getFileText(fileName) {
  const response = await fetch(fileName);
  return response.text();
}

function csvToRowsArray(csvText) {
  let rows = csvText.split('\n');
  rows = rows.map(row => row.split(',').map(element=> element.trim()))
  return rows;
}

function createDatasetForChart(data) {
  let dataset = [];

  data.forEach((row, j) => {
    if(j === 0) {
      row.forEach((ele,i) => {
        dataset[i] ? dataset[i].label = ele : dataset[i] = {label: ele};
      });
    }
    else {
      row.forEach((ele, i) => {
        if(i < dataset.length) {
          dataset[i].data ? dataset[i].data.push(ele) : dataset[i].data = [ele];
        }
      })
    }
  })

  return dataset;
}
