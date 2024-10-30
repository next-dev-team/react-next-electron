import { contextBridge, shell, ipcRenderer } from 'electron';
import i18nSync from './i18n-sync';

const apiKey = '$api';

const hello = (name: string) => {
  return `Welcome ${name}`;
};

/**
 * This allows the renderer (frontend) to communicate with main process (electron/node).
 * You can also create and provide an api layer for the frontend and main process.
 * Anything exposed here is duplicated and attached to window object.
 * No promises, funcs can be directly attached.
 */
const api = {
  versions: process.versions,
  i18nSync,
  showItemInFolder: shell.showItemInFolder,
  hello,
  // Communicate between renderer and main process
  message: {
    send: (payload: unknown) => ipcRenderer.send('message', payload),
    on: (handler: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => ipcRenderer.on('message', handler),
    off: (handler: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => ipcRenderer.off('message', handler),
  },
  // Call an electron api command
  api: async <T>(methodName: string, options?: unknown): Promise<T> =>
    ipcRenderer.invoke('api', methodName, options),
};

contextBridge.exposeInMainWorld(apiKey, api);

export type $Api = typeof api;
