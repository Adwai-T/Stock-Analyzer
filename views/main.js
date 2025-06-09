import { Canvas } from './utils.js';

const containerDiv = document.getElementById('chart-container');
const chartCanvas = new Canvas(500,500);
containerDiv.appendChild(chartCanvas.canvasElement);

// const myChart = new Chart(chartCanvas.ctx, {});

