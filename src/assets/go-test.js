const path = require('path')
const cmd = path.resolve(__dirname, '../go-build/main')
const GoCx = require('./assets/go-cx')
const goCx = new GoCx(cmd)

var i = 0
var interval1 = null
goCx.on('data', (data) => {
  console.log('goCx data', data)
})
goCx.on('error', (data) => {
  console.error('goCx error', data)
})
goCx.on('close', (code) => {
  console.log('goCx closed with code:', code)
  clearInterval(interval1)
})

interval1 = setInterval(function () {
  goCx.request('multiply', {it: i, by: 4}, (res) => {
    console.log("goCx multiply response", res)
  })
  i++
  if (i > 5) {
    clearInterval(interval1)
  }
}, 1000)