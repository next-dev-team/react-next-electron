import { ProCard } from '@ant-design/pro-components';
import { useLocalStorageState } from 'ahooks';
import { Button, notification } from 'antd';

const translate = (key: string) => {
  return key;
};

const { i18nSync, showItemInFolder } = window.$api || {};

const handleSync = (opts = {} as any) => {
  const { scanPath, ...restOpt } = opts || {};

  i18nSync(scanPath, {
    ...restOpt,
    cb(value, error: any) {
      if (error) {
        notification.error({
          message: translate('Error'),
          description: error?.message || 'Unknown Error',
        });
        return;
      }
      notification.success({
        message: translate('Success'),
        description: value,
        btn: (
          <Button
            type="primary"
            onClick={() => {
              showItemInFolder(value);
            }}
          >
            {translate('Output Folder')}
          </Button>
        ),
      });
    },
  });
};

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
  return (
    <ProCard
      title={translate('Configs')}
      extra={
        <Button onClick={() => {
          window.open("/", "_blank", "self")
        }}>API</Button>
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
