import { ProCard } from '@ant-design/pro-components';
import Counter from './Counter'


export default function HomePage() {

  return (
    <ProCard
      title={('Configs')}
      bordered
      headerBordered
      tabs={{
        destroyInactiveTabPane: true,
        items: [
          {
            key: '1',
            label: ('SERVER'),
            children: <Counter />
          },
        ],
      }}
    ></ProCard>
  );
}
