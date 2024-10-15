export default function CounterApp(props: {
  counter: number;
  increment: () => void;
  decrement: () => void;
}) {
  const { counter, increment, decrement } = props;

  return (
    <Space>
      <Button shape="circle" onClick={decrement} type="primary" danger>
        -
      </Button>
      <Button>{counter}</Button>
      <Button shape="circle" onClick={increment} type="primary">
        +
      </Button>
    </Space>
  );
}
