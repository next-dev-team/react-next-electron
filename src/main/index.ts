import { createMainWindow } from '@/main-window';
import { app, protocol } from 'electron';

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
  createMainWindow();
  console.log('App run successfully');
};

app.whenReady().then(onReady).catch(console.log);
