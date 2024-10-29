import { createMainWindow } from '@/main-window';
import { app, protocol } from 'electron';
import { runPython } from './start';

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
  console.log('Python running');
  runPython()
    .then(() => {
      createMainWindow();
      console.log('python run successfully');
    })
    .catch((error) => {
      console.log(error);
    });
}

app.whenReady().then(onReady).catch(console.log);
