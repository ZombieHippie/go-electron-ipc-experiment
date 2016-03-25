// In renderer process (web page).

const ipcRenderer = require('electron').ipcRenderer

const $info = document.getElementById('info')

ipcRenderer.send('set-main', 'me')

var onInfo = function (event, info) {
  console.log(info)
  $info.innerText = JSON.stringify(info, null, 2)
}

ipcRenderer.on('async-reply-info', onInfo)

