import CounterApp from '@/components/Counter/component';
import { counterStore } from '@/models/counter';
import { ProCard } from '@ant-design/pro-components';
import { connect, useModel } from '@umijs/max';
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

function mapStateToProps(state: any) {
  return {
    count: state.count,
    loading: state.loading,
  };
}

const CounterDva = connect(mapStateToProps)((props: any) => {

  useEffect(() => {
    props.dispatch({
      type: 'count/getAsyncCounter',
    });
  }, [])
  console.log(props);


  return (
    <div>
      <CounterApp
        counterAsync={props.count.counterAsync}
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
