import {
  pinokioFs,
  pinokioRawFile,
  pinokioRpcRun,
  pinokioRpcStop,
  pinokioStatus,
  pinokioUrl,
} from '@/utils';
import { DragSortTable, ProCard, ProColumns } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { useReactive } from 'ahooks';
import { Button, Drawer, Image, Space } from 'antd';

const translate = (key: string) => {
  return key;
};

const WeView = () => {
  const {
    data: apiApps,
    loading: apiAppsLoading,
    mutate: mutateApiApps,
  } = useModel('usePinokio');

  const state = useReactive<{
    selectedApp: {
      title?: string;
      icon?: string;
    };
  }>({
    selectedApp: {
      title: '',
      icon: '',
    },
  });

  const handleDragSortEnd = (
    beforeIndex: number,
    afterIndex: number,
    newDataSource: any,
  ) => {
    mutateApiApps(newDataSource);
  };

  console.log('apiApps', apiApps);
  const columns: ProColumns[] = [
    {
      title: 'Title',
      dataIndex: 'name',
      className: 'drag-visible',
    },
    {
      title: 'Icon',
      render(_, entity) {
        return (
          <Image
            width={80}
            src={pinokioRawFile(`${entity.title}/${entity.icon}`)}
            fallback="https://static.vecteezy.com/system/resources/thumbnails/008/328/554/small_2x/api-icon-style-free-vector.jpg"
          />
        );
      },
      className: 'drag-visible',
    },
    {
      title: 'Action',
      width: 100,
      valueType: 'option',
      render: (_, entity) => [
        <Button
          key={'open'}
          onClick={() => {
            const appUrl = `~/api/${entity.title}/start.js`;
            pinokioStatus(appUrl, (isRunning) => {
              if (isRunning) {
                return;
              }
              state.selectedApp = entity;
              pinokioRpcRun(appUrl);
            });
          }}
        >
          Start
        </Button>,
        <Button
          key={'stop'}
          danger
          onClick={() => {
            pinokioRpcStop(`~/api/${entity.title}/start.js`);
          }}
        >
          Stop
        </Button>,
      ],
      align: 'center',
      fixed: 'right',
    },
  ];

  return (
    <div>
      <Drawer
        open={!!state.selectedApp?.title}
        width={'100%'}
        onClose={() => (state.selectedApp = {})}
      >
        <webview
          src={`http://localhost/api/automatic1111.git/start.js`}
          style={{
            width: '100%',
            height: '69vh',
            minHeight: '100%',
            display: 'flex',
          }}
        />
      </Drawer>
      <DragSortTable
        loading={apiAppsLoading}
        headerTitle="APP"
        columns={columns}
        rowKey="title"
        search={false}
        pagination={false}
        dataSource={apiApps}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
      />
    </div>
  );
};

export default function HomePage() {
  return (
    <ProCard
      title={translate('Configs')}
      extra={
        <Space>
          <Button
            onClick={async () => {
              // pinokioFs('api', 'https://github.com/cocktailpeanut/llamacpp.pinokio.git')
              //   .clone('llamacpp.pinokio.git');
              // pinokioFs('api', '.')
              //   .readdir('audiocraft_plus.git');
              const pkapi = pinokioFs('api', '.');

              const allApps = pkapi
                .readdir('.')
                .then((apps) =>
                  Promise.all(
                    apps.map((app) =>
                      pkapi.readdir(app).then((res) => ({ [app]: res })),
                    ),
                  ),
                );
              allApps.then((res) => console.log('apps', res));
            }}
          >
            RPC 1
          </Button>
          <Button
            onClick={async () => {
              const width = screen.width * 0.8;
              const height = screen.height * 0.8;
              const left = (screen.width - width) / 2;
              const top = (screen.height - height) / 2;
              window.open(pinokioUrl, '_blank', `width=${width},height=${height},left=${left},top=${top}`);
            }}
          >
            Server Settings
          </Button>
        </Space>
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
