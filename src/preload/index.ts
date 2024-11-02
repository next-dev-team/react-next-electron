import { contextBridge, shell, ipcRenderer } from 'electron';
// import i18nSync from './i18n-sync';

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


// put this preload for main-window to give it prompt()
window.prompt = function (title, val) {
  return ipcRenderer.sendSync('prompt', { title, val })
}
const sendPinokio = (action) => {
  console.log("window.parent == window.top?", window.parent === window.top, action, location.href)
  if (window.parent === window.top) {
    window.parent.postMessage({
      action
    }, "*")
  }
}


// ONLY WHEN IN CHILD FRAME
if (window.parent === window.top) {
  if (window.location !== window.parent.location) {
    let prevUrl = document.location.href
    sendPinokio({
      type: "location",
      url: prevUrl
    })
    setInterval(() => {
      const currUrl = document.location.href;
      //    console.log({ currUrl, prevUrl })
      if (currUrl !== prevUrl) {
        // URL changed
        prevUrl = currUrl;
        console.log(`URL changed to : ${currUrl}`);
        sendPinokio({
          type: "location",
          url: currUrl
        })
      }
    }, 100);
    window.addEventListener("message", (event) => {
      if (event.data) {
        console.log("event.data = ", event.data)
        console.log("location.href = ", location.href)
        if (event.data.action === "back") {
          history.back()
        } else if (event.data.action === "forward") {
          history.forward()
        } else if (event.data.action === "refresh") {
          location.reload()
        }
      }
    })
  }
}


//document.addEventListener("DOMContentLoaded", (e) => {
//  if (window.parent === window.top) {
//    window.parent.postMessage({
//      action: {
//        type: "title",
//        text: document.title
//      }
//    }, "*")
//  }
//})
window.electronAPI = {
  send: (type, msg) => {
    ipcRenderer.send(type, msg)
  }
}

const api = {
  versions: process.versions,
  // i18nSync,
  showItemInFolder: shell.showItemInFolder,
  hello,
  // Communicate between renderer and main process
  ipcSend: (payload: unknown) => ipcRenderer.send('message', payload),
  ipcOn: (handler: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => ipcRenderer.on('message', handler),
  ipcOff: (handler: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void) => ipcRenderer.off('message', handler),
  // Call an electron api command
  api: async <T>(methodName: string, options?: unknown): Promise<T> =>
    ipcRenderer.invoke('api', methodName, options),
};

contextBridge.exposeInMainWorld(apiKey, api);

export type $Api = typeof api;
