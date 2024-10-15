import CounterApp from '@/components/Counter/component';
import { counterStore } from '@/stores';
import { ProCard } from '@ant-design/pro-components';
import { connect, useModel } from '@umijs/max';
import { Flex } from 'antd';

const CounterModel = () => {
  const { counter, decrement, increment } = useModel('useCount');
  return (
    <CounterApp counter={counter} increment={increment} decrement={decrement} />
  );
};

const CounterValitio = () => {
  const snap = useSnapshot(counterStore);
  return (
    <CounterApp
      counter={snap.count}
      increment={snap.inc}
      decrement={snap.dec}
    />
  );
};

function mapStateToProps(state: any) {
  return {
    count: state.count,
    loading: state.loading,
  };
}

const CounterDva = connect(mapStateToProps)((props: any) => {
  return (
    <div>
      <CounterApp
        counter={props.count.count}
        increment={() => {
          props.dispatch({
            type: 'count/increment',
          });
        }}
        decrement={() => {
          props.dispatch({
            type: 'count/decrement',
          });
        }}
      />
    </div>
  );
});

const TestPage = () => {
  return (
    <Flex gap={10}>
      <ProCard bordered headerBordered title={'Counter with useModel'}>
        <CounterModel />
      </ProCard>
      <ProCard bordered headerBordered title={'Counter with Valitio'}>
        <CounterValitio />
      </ProCard>

      <ProCard bordered title={'Counter with DVA'}>
        <CounterDva />
      </ProCard>
    </Flex>
  );
};

export default TestPage;
