import { contextBridge, shell } from 'electron';
import i18nSync from './i18n-sync';

const apiKey = '$api';

const hello = (name: string) => {
  return `Welcome ${name}`;
};

const api = {
  versions: process.versions,
  i18nSync,
  showItemInFolder: shell.showItemInFolder,
  hello,
};

contextBridge.exposeInMainWorld(apiKey, api);

export type $Api = typeof api;
