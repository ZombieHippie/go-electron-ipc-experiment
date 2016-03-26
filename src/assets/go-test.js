
const spawn = require('child_process').spawn

const path = require('path')

const cmd = path.resolve(__dirname, '../go-build/main')

var main = spawn(cmd)

function Uint8ToString (u8a) {
  var CHUNK_SZ = 0x8000;
  var c = [];
  for (var i=0; i < u8a.length; i+=CHUNK_SZ) {
    c.push(String.fromCharCode.apply(null, u8a.subarray(i, i+CHUNK_SZ)));
  }
  return c.join("");
}


main.stdout.on('data', (data) => {
  console.log("Go Received", Uint8ToString(data))
})

main.stderr.on('data', (data) => {
  console.error("Go Error", Uint8ToString(data))
})

main.on('close', (code) => {
  console.error("Go Closed", Uint8ToString(data))
})

var i = 0

setInterval(function () {
  main.stdin.write(JSON.stringify({ i: i, a: [i, i] }) + '\n')
}, 1000)