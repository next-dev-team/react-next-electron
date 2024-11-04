import { createMainWindow } from '@/main-window';
import { app, dialog, ipcMain, MessageBoxOptions, protocol } from 'electron';
import { startAppiumServer } from './start';

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
    },
  },
]);

const onReady = () => {
  startAppiumServer()
    .then(() => {
      createMainWindow();
    })
    .catch(() => {
      alert('start appium server error');
    });
};

ipcMain.on('dialog', (_: any, params: MessageBoxOptions) => {
  dialog.showMessageBox(params);
});

app.whenReady().then(onReady).catch(console.log);
