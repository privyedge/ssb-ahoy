const electron = require('electron')
const join = require('path').join
const WindowState = require('electron-window-state')

module.exports = function uiWindow (path, opts, config) {
  var windowState = WindowState({
    defaultWidth: 1024,
    defaultHeight: 768
  })

  opts = Object.assign({
    title: 'InitialSync',
    show: true,

    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 800,

    autoHideMenuBar: true,
    frame: true, // !process.env.FRAME,
    // titleBarStyle: 'hidden',
    backgroundColor: '#fff',
    icon: '../../assets/icon.png' // TODO may need fixing
  }, opts)

  var win = new electron.BrowserWindow(opts)
  windowState.manage(win)

  win.webContents.on('dom-ready', function () {
    win.webContents.executeJavaScript(`
      var electron = require('electron')
      var h = require('mutant/h')
      electron.webFrame.setVisualZoomLevelLimits(1, 1)
      var title = ${JSON.stringify(opts.title || 'InitialSync')}
      document.documentElement.querySelector('head').appendChild(
        h('title', title)
      )
      require(${JSON.stringify(path)})(${JSON.stringify(config)})
    `)
  })

  win.webContents.on('will-navigate', function (e, url) {
    e.preventDefault()
    electron.shell.openExternal(url)
  })

  win.webContents.on('new-window', function (e, url) {
    e.preventDefault()
    electron.shell.openExternal(url)
  })

  win.loadURL('file://' + join(__dirname, '../assets/base.html'))
  return win
}