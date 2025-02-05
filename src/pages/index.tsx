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
import { Avatar, Button, Drawer, Image, Space } from 'antd';
import { useEffect } from 'react';
import { terminal } from '@umijs/max';

const translate = (key: string) => {
  return key;
};

const WeView = () => {
  const {
    data: apiApps,
    loading: apiAppsLoading,
    mutate: mutateApiApps,
    refresh: refreshApiApps,
  } = useModel('usePinokio');

  const state = useReactive<{
    selectedApp: {
      startUrl?: string;
      title?: string;
      icon?: string;
    };
  }>({
    selectedApp: {
      startUrl: '',
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

  terminal.error('apiApps', apiApps);

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
            src={entity.iconUrl}
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
            const baseUrl = `${pinokioUrl}/api/${entity.title}`;
            const appStartUrl = `${baseUrl}/start.js`;

            const appUrl = `~/api/${entity.title}/start.js`;

            // Gepeto
            if (entity.title === 'gepeto.git') {
              ;
              state.selectedApp = {
                ...entity,
                startUrl: `${baseUrl}/index.html?raw=true`
              };
              return
            }

            pinokioStatus(appUrl, (isRunning) => {
              if (isRunning) {
                return;
              }
              state.selectedApp = {
                ...entity,
                startUrl: appStartUrl
              };
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
  console.log('selectedApp', state.selectedApp);

  const handleOnClose = () => {
    state.selectedApp = {};
    refreshApiApps();
  }

  return (
    <div>
      <Drawer
        open={!!state.selectedApp?.title}
        width={'100%'}
        onClose={handleOnClose}
        title={<Space>
          <Avatar size="large" src={state.selectedApp?.iconUrl} />
          {state.selectedApp?.name}
        </Space>}
      >
        <webview
          src={state.selectedApp?.startUrl}
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
        optionsRender={(p, dom) => {
          return [<Button
            key={'open'}
            onClick={async () => {
              state.selectedApp = {
                startUrl: pinokioUrl,
                title: 'pinokio',
              };
            }}
          >
            Server
          </Button>, ...dom]
        }
        }
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
  const handleCheckIsApiRunning = async (isExist) => {
    const apiApp = `~/api/next-api.git/start.js`;
    const apiInstallApp = `~/api/next-api.git/install.js`;

    // check exist
    if (!isExist) {
      // console.log('please download api first');
      return;
    }

    // start running
    // pinokioStatus(apiApp, async (isRunning) => {
    //   if (!isRunning) {
    //     console.log('API not running', isRunning)
    //     await sleep(2000);
    //     console.log('API is installing')
    //     pinokioRpcRun(apiInstallApp);
    //     return;
    //   }
    // });
  };

  // useEffect(() => {
  //   (async () => {
  //     await pinokioFs('api', '.')
  //       .exists('next-api.git')
  //       .then(handleCheckIsApiRunning)
  //       .catch((err) => {
  //         console.log('not exist', err);
  //       });
  //   })();
  // }, []);

  return (
    <ProCard
      title={translate('Configs')}
      extra={
        <Space>
          {/* <Button
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
            RPC
          </Button> */}
          <Button
            onClick={async () => {
              const width = screen.width * 0.8;
              const height = screen.height * 0.8;
              const left = (screen.width - width) / 2;
              const top = (screen.height - height) / 2;
              window.open(
                pinokioUrl,
                '_blank',
                `width=${width},height=${height},left=${left},top=${top}`,
              );
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
