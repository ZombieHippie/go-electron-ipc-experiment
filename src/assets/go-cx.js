const EventEmitter = require('events')
const util = require('util')

function createMessageId () {
  return Math.random().toString(36).slice(1,10)
}

const protobufs = require('./protobufs')
window.protobufs = protobufs

console.log(protobufs)
window.buf1 = protobufs.math.MathOperation.encode({
  id: "awd",
  left_hand_side: 12,
  right_hand_side: 412,
  operation: protobufs.math.MathOperation_MULTIPLY
})

console.log(buf1, buf1.length)

window.dec1 = protobufs.math.MathOperation.decode(buf1)
console.log(dec1)


const spawn = require('child_process').spawn

function GoCx(cx_cmd, service_cmd) {
  EventEmitter.call(this)
  const main = spawn(cx_cmd)
  const service = spawn(service_cmd)

  main.on('message', (message, sendHandle) => {
    console.log('on message', message, sendHandle)
  })
  main.on('close', (code) => {
    this.emit('close', code)
  })
  main.stderr.on('data', (data) => {
    var error = Uint8ToString(data)
    console.error("Go Error", error)
    this.emit('error', error)
  })
  main.stdout.on('data', (buf) => {
    console.log("==== buf", buf)
    var data = Uint8ToString(buf)
    event = 'data'
    try {
      console.log("==== data", data)
      var decode = protobufs.math.MathResult.decode(buf)
      console.log("==== decode", decode)
      /*data = JSON.parse(data)
      if (data && data.id) {
        event = data.id; data = data.data
      }*/
    } catch (err) {}
    this.emit(event, data)//*/
  })
  this.main = main
}

GoCx.prototype.request = function (cmd, data, callback) {
  var id = createMessageId()
  return
  if (cmd == 'multiply') {
    var buf = protobufs.math.MathOperation.encode({
      id: id,
      left_hand_side: data.It,
      right_hand_side: data.By,
      operation: protobufs.math.MathOperation_MULTIPLY
    })
    console.log("->GO", buf)
    var buflen = new Buffer(4)
    buflen.writeUIntBE(buf.length, 0)
    this.main.stdin.write(buflen)
    this.main.stdin.write(buf)
    this.once(id, callback)
  }
}

util.inherits(GoCx, EventEmitter)

module.exports = GoCx
