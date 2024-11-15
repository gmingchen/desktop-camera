import { app, shell, BrowserWindow, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

const size = 200
const minSize = 150
const maxSize = 600

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: size,
    height: size,
    minWidth: minSize,
    minHeight: minSize,
    maxWidth: maxSize,
    maxHeight: maxSize,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // globalShortcut.register('Alt+CommandOrControl+Shift+D', () => {
  // mainWindow.webContents.openDevTools({ mode: 'detach' }) //开启开发者工具
  // })

  const shortcuts = [
    'Alt+CommandOrControl+Shift+Q', // 放大比例
    'Alt+CommandOrControl+Shift+W', // 缩小比例
    'Alt+CommandOrControl+Shift+A', // 反向切换形状
    'Alt+CommandOrControl+Shift+S' // 正向切换形状
  ]
  shortcuts.forEach((shortcut) => {
    globalShortcut.register(shortcut, () => {
      mainWindow.webContents.send(shortcut)
    })
  })

  const speed = 10
  // 放大窗口
  globalShortcut.register('Alt+CommandOrControl+Shift+Z', () => {
    const [width, height] = mainWindow.getContentSize()
    if (width + speed <= maxSize) {
      mainWindow.setSize(width + speed, height + speed)
    }
  })
  // 缩小窗口
  globalShortcut.register('Alt+CommandOrControl+Shift+X', () => {
    const [width, height] = mainWindow.getContentSize()
    if (width - speed > minSize) {
      mainWindow.setSize(width - speed, height - speed)
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
