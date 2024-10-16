import CounterApp from '@/components/Counter/component';
import { counterStore } from '@/models/counter';
import { ProCard } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Flex } from 'antd';

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

const TestPage = () => {
  return (
    <Flex gap={10}>
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
