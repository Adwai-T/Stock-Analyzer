export function log() {
  console.log('Log From view-utils');
}

export class Canvas {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.canvasElement = document.createElement('canvas');
    this.ctx = this.canvasElement.getContext('2d');
    this.canvasElement.width= width;
    this.canvasElement.height = height;
  }
  
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
}

