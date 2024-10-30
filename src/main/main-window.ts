import createProtocol from '@/create-protocol';
import { app, BrowserWindow, session } from 'electron';
import * as path from 'node:path';
import { killPython } from './start';
const Pinokiod = require("pinokiod");
const Store = require("electron-store");
import packagejson from '../../package.json'

export type IContext = {
  /** is allowed quit app */
  allowQuitting: boolean;
  /** main window */
  mainWindow?: BrowserWindow;
};
const isDevelopment = process.env.NODE_ENV === 'development';
const context: IContext = {
  allowQuitting: false,
};

const hideMainWindow = () => {
  if (context.mainWindow && !context.mainWindow.isDestroyed()) {
    context.mainWindow.hide();
  }
};

const showMainWindow = () => {
  if (context.mainWindow && !context.mainWindow.isDestroyed()) {
    context.mainWindow.show();
  }
};

async function createMainWindow() {
  const store = new Store();
  const pinokiod = new Pinokiod({
    //  port: PORT,
    agent: "electron",
    version: packagejson.version,
    store
  })
  await pinokiod.start({
    browser: {
      clearCache: async () => {
        console.log("clear cache", session.defaultSession);
        await session.defaultSession.clearStorageData();
        console.log("cleared");
      },
    },
  });
  // PORT = pinokiod.port;
  // theme = pinokiod.theme;
  // colors = pinokiod.colors;
  console.log("pinokiod", pinokiod);


  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  });
  context.mainWindow = mainWindow;
  context.mainWindow.on('close', (event) => {
    if (process.platform !== 'darwin') {
      context.allowQuitting = true;
    }
    if (!context.allowQuitting) {
      event.preventDefault();
      hideMainWindow();
    } else {
      context.mainWindow = undefined;
    }
  });
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:8000');
    mainWindow.webContents.openDevTools();
  } else {
    createProtocol('app');
    mainWindow.loadURL('app://./index.html');
  }
}

// quit app set allowQuitting to true
app.on('before-quit', () => {
  context.allowQuitting = true;
});

app.on('window-all-closed', () => {
  killPython();
  console.log('window-all-closed');

  if (process.platform !== 'darwin') {
    setTimeout(() => app.quit(), 1000);
  }
});

app.on('activate', () => {
  if (app.isReady()) {
    if (context.mainWindow === undefined) {
      createMainWindow();
    } else {
      showMainWindow();
    }
  }
});

export { createMainWindow };
