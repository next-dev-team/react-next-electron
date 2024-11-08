import CounterApp from '@/components/Counter/component';
import { counterStore } from '@/models/counter';
import { ProCard } from '@ant-design/pro-components';
import { useModel, useSnapshot, useRequest, request } from '@umijs/max';
import { Button, Flex, Space } from 'antd';
import { useEffect } from 'react';

const CounterModel = () => {
  const { counter, decrement, increment, counterAsync } = useModel('useCount');
  return (
    <CounterApp
      counter={counter}
      increment={increment}
      decrement={decrement}
      counterAsync={counterAsync}
    />
  );
};

const CounterValitio = () => {
  const snap = useSnapshot(counterStore);

  useEffect(() => {
    counterStore.getAsyncCounter();
  }, []);

  return (
    <CounterApp
      counter={snap.count}
      increment={snap.inc}
      decrement={snap.dec}
      counterAsync={snap.counterAsync}
    />
  );
};

const testPingApi = async () => {
  const res = await request('http://localhost:8901/ping');
  return {
    data: res
  };
}

const PythonTest = () => {
  const { data, loading, mutate, refresh } = useRequest(testPingApi);
  return (
    <Space>
      <Button danger onClick={() => mutate({})}>Reset</Button>
      <Button loading={loading}>{JSON.stringify(data)}</Button>
      <Button type="primary" onClick={() => refresh()}>Refresh</Button>
    </Space>
  );
};

const TestPage = () => {
  return (
    <Flex gap={10}>
      <ProCard bordered headerBordered title={'Test Pinokio API'}>
        <PythonTest />
      </ProCard>
      <ProCard bordered headerBordered title={'Counter with useModel'}>
        <CounterModel />
      </ProCard>
      <ProCard bordered headerBordered title={'Counter with Valitio'}>
        <CounterValitio />
      </ProCard>
    </Flex>
  );
};

export default TestPage;
