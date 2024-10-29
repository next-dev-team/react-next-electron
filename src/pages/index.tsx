import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
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

const SyncForm = () => {
  const [formState, setFormState] = useLocalStorageState('formState', {
    defaultValue: {
      i18nUrl: '',
      isScanAll: true,
      isForceOverwrite: true,
    },
  });

  return (
    <ProForm
      onFinish={async (values: any) => {
        console.log('formState', values);

        const nextValues = {
          ...values,
          isForceOverwrite: true,
          isScanAll: true,
        };

        setFormState(nextValues);
        handleSync(nextValues);
      }}
      initialValues={{
        ...formState,
      }}
    >
      <ProFormCheckbox
        name="isForceOverwrite"
        width={'md'}
        label={translate('Force Overwrite')}
        tooltip={translate('Overwrite file')}
      />

      <ProFormCheckbox
        name="isScanAll"
        width={'md'}
        label={translate('Scan All')}
        tooltip={translate(
          'Scan all will include dynamic params or server translate',
        )}
      />

      <ProFormText
        name="i18nUrl"
        rules={[
          {
            type: 'url',
            message: translate('Must be valid full API URL'),
          },
        ]}
        label={translate('API URL')}
      />
      <ProFormText
        rules={[
          {
            whitespace: true,
            message: translate('Whitespace are not allowed'),
          },
          {
            required: true,
            message: translate(
              'Must be a absolute path eg. D:\\projects\\test\\project\\src',
            ),
          },
        ]}
        name="scanPath"
        label={translate('Full Path')}
      />
    </ProForm>
  );
};

export default function HomePage() {
  return (
    <ProCard
      title={translate('I18n Management')}
      bordered
      headerBordered
      tabs={{
        destroyInactiveTabPane: true,
        items: [
          {
            key: '1',
            label: translate('I18N SYNC'),
            children: <SyncForm />,
          },
          {
            key: '2',
            label: translate('I18N SYNC'),
            children: <SyncForm />,
          },
        ],
      }}
    ></ProCard>
  );
}
