import { ProCard } from '@ant-design/pro-components';
import { Button, notification } from 'antd';
import Pinokio from 'pinokiojs';

const translate = (key: string) => {
  return key;
};

const {  showItemInFolder } = window.$api || {};

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
    http: "http://localhost:80",
    fs: "http://localhost:80/fs",
    rpc: "ws://localhost:80",
  })

  const api = async () => {
   const allPort =   pinokio.rpc
  console.log('f', allPort);

  }

  useEffect(() => {
    api();
  }, []);

  return (
    <ProCard
      title={translate('Configs')}
      extra={
        <Button
          onClick={() => {
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
