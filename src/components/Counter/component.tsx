import { Button, Space } from "antd";

export default function CounterApp(props: {
  counter: number;
  counterAsync: number;
  increment: () => void;
  decrement: () => void;
}) {
  const { counter, increment, decrement, counterAsync } = props;

  return (
    <Space>
      <Space>
        <Button shape="circle" onClick={decrement} type="primary" danger>
          -
        </Button>
        <Button>{counter}</Button>
        <Button shape="circle" onClick={increment} type="primary">
          +
        </Button>
      </Space>
      <Button type="primary">Async Counter {counterAsync}</Button>
    </Space>
  );
}
