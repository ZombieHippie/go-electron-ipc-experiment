const EventEmitter = require('events')
const util = require('util')

function Uint8ToString (u8a) {
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
  }
  return c.join("");
}

function createMessageId () {
  return Math.random().toString(36).slice(1,10)
}

const spawn = require('child_process').spawn

function GoCx(cmd) {
  EventEmitter.call(this)
  const main = spawn(cmd)
  main.on('close', (code) => {
    this.emit('close', code)
  })
  main.stderr.on('data', (data) => {
    var error = Uint8ToString(data)
    console.error("Go Error", error)
    this.emit('error', error)
  })
  main.stdout.on('data', (data) => {
    data = Uint8ToString(data)
    event = 'data'
    try {
      data = JSON.parse(data)
      if (data && data.id) {
        event = data.id; data = data.data
      }
    } catch (err) {}
    this.emit(event, data)
  })
  this.main = main
}

GoCx.prototype.request = function (cmd, data, callback) {
  var id = createMessageId()
  var str = JSON.stringify({
    'cmd':  cmd,
    'id':   id,
    'data': data
  })
  this.main.stdin.write(str + '\n')
  this.once(id, callback)
}

util.inherits(GoCx, EventEmitter)

module.exports = GoCx
