//draw a plane with width 200 and height 200
console.log("Hello")
window.p5 = require('./assets/p5.js')

console.log("Hello post p5")

var draw_queue = [
  ['rect', 400, 250, 20, 20],
  ['fill', 'rgb(236, 64, 162)'],
  ['background', '#34556a'],
]

const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('draw', function(event, arg) {
  draw_queue.push(arg)
});
ipcRenderer.on('draws', function(event, arg) {
  var i = arg.length
  while (i--) {
    draw_queue.push(arg[i])
  }
});

ipcRenderer.send('set-sender')

var up, bottom, left, right
var midX, midY

var canvas = document.getElementById("defaultCanvas0")

function setDimensions() {
    W = innerWidth
    H = innerHeight

    midX = W/2
    midY = H/2

    up = {x: midX, y: -H * 2}
    bottom = {x: midX, y: H * 4}
    left = {x: -W/2, y: midY}
    right = {x: W * 1.5 - 2, y: midY}


    ipcRenderer.send('set-dimensions', {
      W: W, H: H, midX: midX, midY: midY,
      up: up, bottom: bottom, left: left, right: right
    })
}
window.onresize = setDimensions
/*
*/

function setup() {
  createCanvas(700, 700)
  setDimensions()
}

var testOut = document.getElementById('test')
function draw() {
  var m = ''
  while (draw_queue.length > 0) {
    var args = draw_queue.pop()
    //m += JSON.stringify(args) + '\n'
    var fn = window[args[0]]
    fn && fn.apply && fn.apply(this, args.slice(1))
  }
  //testOut.innerText = m
}
