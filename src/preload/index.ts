import { contextBridge, ipcRenderer, shell } from 'electron';
// import i18nSync from './i18n-sync';

const apiKey = '$api';

const hello = (name: string) => {
  return `Welcome ${name}`;
};

const api = {
  versions: process.versions,
  // i18nSync,
  showItemInFolder: shell.showItemInFolder,
  hello,
  // Communicate between renderer and main process
  ipcSend: (payload: unknown) => ipcRenderer.send('message', payload),
  ipcOn: (
    handler: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void,
  ) => ipcRenderer.on('message', handler),
  ipcOff: (
    handler: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void,
  ) => ipcRenderer.off('message', handler),
  // Call an electron api command
  api: async <T>(methodName: string, options?: unknown): Promise<T> =>
    ipcRenderer.invoke('api', methodName, options),
};

contextBridge.exposeInMainWorld(apiKey, api);

export type $Api = typeof api;
