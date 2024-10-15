import { contextBridge, shell } from 'electron';
import i18nSync from './i18n-sync';

const apiKey = '$api';

const api = {
  versions: process.versions,
  i18nSync,
  showItemInFolder: shell.showItemInFolder,
};

contextBridge.exposeInMainWorld(apiKey, api);

export type $Api = typeof api;
