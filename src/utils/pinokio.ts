import Pinokio from 'pinokiojs';

const pinokio = new Pinokio({
  http: 'http://localhost',
  ws: 'ws://localhost',
});

// const URI = '~/api/whisper-webui.git/start.js';

const pinokioRpc = pinokio.rpc();
export const pinokioPort = pinokio.port();
export const pinokioUrl = pinokio.url.http;

export const pinokioRawFile = (filepath: string, drive = 'api') => {
  const path = filepath ? `${pinokioUrl}/${drive}/${filepath}?raw=true` : '';
  console.log('filepath', path);
  return path;
};

export const pinokioFs = (drive: string, path: string) => {
  const pinokioFs = pinokio.fs(drive, path);
  return pinokioFs;
};

export const pinokioRpcRun = (uri: string, ondata?: any) => {
  return pinokioRpc.run(
    {
      uri,
    },
    (packet: any) => {
      console.log('packet', packet);
      ondata?.(packet);
      //
      //  req := {
      //    uri: <the pinokio file system path>
      //  }
      //
      //  example uris:
      //  1. local uri: ~/api/test/start.json
      //  2. public uri: https://github.com/cocktailpeanut/automatic1111.pinokio.git/install.json
      //

      //
      //  packet = {
      //    id,
      //    type: “stream”,
      //    index: <current task index>,
      //    data: <streaming data returned from the module>
      //  }
      //
      //  // 2. triggered once at the end of every step
      //  packet = {
      //    id,
      //    type: “result”,
      //    index: <current task index>,
      //    data: <final returned result from the module>
      //  }
      //
      //  // 3. triggered at the end of an entire run loop
      //  packet = {
      //    id,
      //    type: “event”,
      //    data: “stop”
      //  }
      //
      //  // 4. info
      //  packet = {
      //    id,
      //    type: “info”,
      //    data: data
      //  }
      //
      //  // 5. error
      //  packet = {
      //    id,
      //    type: “error”,
      //    data: data
      //  }
      //
    },
  );
};

export const pinokioStatus = (uri, ondata?: any) => {
  return pinokioRpc
    .status({ uri })
    .then((res: any) => {
      console.log('res', res);
      ondata?.(res);
      return res;
    })
    .catch((err) => {
      console.log('err', err);
      ondata?.(false, err);
      return err;
    });
};

export const pinokioRpcStop = (uri: string, ondata?: any) => {
  try {
    pinokioRpc.stop({ uri });
  } catch (error) {
    console.error('Error stopping pinokio rpc', error);
  }
};
