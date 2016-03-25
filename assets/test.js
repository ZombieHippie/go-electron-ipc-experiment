//draw a plane with width 200 and height 200
/*function setup() {
  createCanvas(700, 700, WEBGL, true);
}

function draw() {
  background("#eeee02");
  fill("rgba(72, 236, 64, 0.75)");
  plane(200, 200);
  ellipse(50, 50, 80, 80);
}
*/
require('./assets/p5.js')

var W, H

var canvas, ctx, frameCount = 0
var noise

var up, bottom, left, right
var midX, midY

var dark = '#290700'
var lightComponents = [63, 56, 65]
var light = toHslString(lightComponents)
var firstColor = dark

var STEP = 6

onload = function () {
    setup()
    loop()
}

onmousemove = function (e) {
    midX = e.clientX
    left.y = right.y = e.clientY

    lightComponents[0] = (map(e.clientY, 0, innerHeight, 0, 360) + 63) % 360
    light = toHslString(lightComponents)
}


//Stolen from p5js
function map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2
}

function setDimensions() {
    W = innerWidth
    H = innerHeight
    canvas.width = W
    canvas.height = H

    midX = W/2
    midY = H/2

    up = {x: midX, y: -H * 2}
    bottom = {x: midX, y: H * 4}
    left = {x: -W/2, y: midY}
    right = {x: W * 1.5 - 2, y: midY}
}

window.onresize = setDimensions

function setCanvas() {
    canvas = document.querySelector('canvas')
    ctx = canvas.getContext('2d')
}

function setup() {
    setCanvas()
    setDimensions()
}

function loop() {
    firstColor = dark

    requestAnimationFrame(loop)
    ++frameCount

    ctx.clearRect(0, 0, W, H)

    for (var cy = up.y; cy < bottom.y; cy += STEP) {
        drawLines(cy)
    }
}

function drawLines(y) {
    ctx.beginPath()
    ctx.moveTo(midX-1, up.y)
    ctx.lineTo(midX-1, bottom.y)
    ctx.lineWidth = 3
    ctx.strokeStyle = dark
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(left.x, left.y)
    ctx.lineTo(midX, y)
    ctx.lineWidth = STEP+1;
    ctx.strokeStyle = firstColor == dark ? firstColor : light
    ctx.stroke()

    ctx.beginPath()

    ctx.moveTo(right.x, right.y)
    ctx.lineTo(midX, y)
    ctx.lineWidth = STEP+1;

    if (firstColor == dark) {
        ctx.strokeStyle = getLightGradient(y)
    } else {
        ctx.strokeStyle = dark
    }

    ctx.stroke()

    firstColor = firstColor == dark ? light : dark
}

function getLightGradient(y) {
    var grad = ctx.createLinearGradient(midX,y,right.x,right.y)
    grad.addColorStop(0, dark)
    grad.addColorStop(0.8, light)
    return grad
}

function toHslString(colorArray) {
    return 'hsl(' + colorArray[0] + ',' + colorArray[1] + '%,' + colorArray[2] + '%)'
}
