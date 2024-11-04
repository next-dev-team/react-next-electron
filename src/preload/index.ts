import { contextBridge, ipcRenderer, shell } from 'electron';
import * as wd from './wd';

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

const modules = {
  ...wd,
};

const api = {
  ...modules,
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
  ipcInvoke: async <T>(methodName: string, options?: unknown): Promise<T> =>
    ipcRenderer.invoke('invoke', methodName, options),
  openDialog: (method: any, config: any) =>
    ipcRenderer.send('dialog', method, config),
};

contextBridge.exposeInMainWorld(apiKey, api);

export type $Api = typeof api;
