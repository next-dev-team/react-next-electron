import { ProCard } from '@ant-design/pro-components';
import { Button, notification } from 'antd';
import Pinokio from 'pinokiojs';

const translate = (key: string) => {
  return key;
};

const { showItemInFolder } = window.$api || {};

const WeView = () => {
  return (
    <div className="">
      <webview
        src={'http://localhost/'}
        style={{
          width: '100%',
          height: '69vh',
          minHeight: '100%',
          display: 'flex',
        }}
      />
    </div>
  );
};

export default function HomePage() {

  const pinokio = new Pinokio({
    http: 'http://localhost',
    ws: 'ws://localhost'
  })

  const api = async () => {
    const rpc = pinokio.rpc()
    await rpc.run({
      uri: '~/api/whisper-webui.git/start.js'
    }, (packet: any) => {

      console.log('packet', packet);
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

    })

  }

  useEffect(() => {
    api()
  }, [])


  return (
    <ProCard
      title={translate('Configs')}
      extra={
        <Button
          onClick={async () => {
            window.open('http://localhost');
          }}
        >
          Server Settings

        </Button>
      }
      bordered
      headerBordered
      tabs={{
        destroyInactiveTabPane: true,
        items: [
          {
            key: '1',
            label: translate('SERVER'),
            children: <WeView />,
          },
        ],
      }}
    ></ProCard>
  );
}
