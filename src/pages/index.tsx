import { _api } from '@/utils';
import { ProCard } from '@ant-design/pro-components';


export default function HomePage() {
  console.log("api", _api);

  return (
    <ProCard
      title={_api.versions.electron}
      bordered
      headerBordered
    >


    </ProCard>
  );
}
