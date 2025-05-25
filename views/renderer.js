import { Canvas, log } from './view-utils.mjs';

log();
const containerDiv = document.getElementById('chart-container');
console.log('Container - ', containerDiv);
const chartCanvas = new Canvas(500,500);
containerDiv.appendChild(chartCanvas.canvasElement);

// const myChart = new Chart(chartCanvas.ctx, {});

