'use strict';
const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {

  // In main process.
  const ipcMain = require('electron').ipcMain;

  let sender = null
  let size = {W: 1200, H: 600, midX: 600, midY: 300 }

  ipcMain.on('set-dimensions', function(event, args) {
    console.log('set-dimensions', args)
    size.W = args.W; size.H = args.H;
    size.midX = args.midX; size.midY = args.midY;
  })
  var interval1 = null
  var i = 0
  var di = 0
  var ai = 0.1
  var getI = function () {
    i = di + i
    di = ai + di
    if (Math.abs(di) > 5) ai = -1 * ai
    return i
  }
  ipcMain.on('set-sender', function(event, args) {
    console.log('set-sender', args)
    sender = event.sender
    setTimeout(function () {
      interval1 = setInterval(function () {
        var i = getI()
        if(i === 0) i += di * 0.01
        sender.send('draws', [
          ['background', i%255],
          ['fill', 12, 255, (256-i)%255],
          ['rect', 50, 50, 50 * i, 50 * i],
          ['fill', (256-i)%255, 12, 255],
          [
            'quad',
            size.midX / 10 * i + 20,  10,
            10,                   size.H / i + i * 5,
            0,                    size.H,
            i * 5 + 12,          (size.H - 8 * i) % size.H,
            size.W - 60 * i,     i * 50
          ]
        ])
      }, 20)
    }, 200)
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({ width: size.W, height: size.H });

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    clearInterval(interval1)
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
