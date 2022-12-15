/*
 * @Author: tushan
 * @Date: 2022-12-14 21:13:56
 * @LastEditors: tushan
 * @LastEditTime: 2022-12-15 19:11:17
 * @Description: 
 */
// Modules to control application life and create native browser window
const { app, session, BrowserWindow, ipcRenderer, ipcMain } = require('electron')
const path = require('path')

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    resizable: true,

    webPreferences: {
      webviewTag: true,
      // webSecurity: false,
      nodeIntegration: true,
      contextIsolation: false,
      // nodeIntegrationInWorker: true,
      // nodeIntegrationInSubFrames: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  // mainWindow.loadURL("https://baidu.com")

  // Open the DevTools.

  ipcMain.on("getCookie", function (event, data) {
    session.defaultSession.cookies.get({ domain: data.domain }).then(el => {
      event.reply("message", el)
    })
  })
  ipcMain.on("reload", function (event, data) {
    app.relaunch()
    app.exit()
  })
  ipcMain.on("trem", function (event, data) {
    mainWindow.webContents.openDevTools()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  // 解决qq一键登录跨域问题
  // app.commandLine.appendSwitch('disable-features', 'BlockInsecurePrivateNetworkRequests')

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
