const d3n=require('d3-node');
const canvasModule = require('canvas');
const fs = require('fs');

const d3n = new D3Node({ canvasModule }); // pass it node-canvas
const canvas = d3n.createCanvas(960, 500);
const context = canvas.getContext('2d');
 // draw on your canvas, then output canvas to png
canvas.pngStream().pipe(fs.createWriteStream('output.png'));