import { createMainWindow } from '@/main-window';
import { app, dialog, protocol } from 'electron';
import { startApi, runPython } from './start';

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
  const usePy = true
  runPython()

  // startApi(usePy)
  runPython()
    .then(() => {
      createMainWindow();
      console.log('App run successfully');
    })
    .catch((error) => {
      dialog.showErrorBox('Server Error', JSON.stringify(error),);
      createMainWindow();
    });
};

app.whenReady().then(onReady).catch(console.log);
