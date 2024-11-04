import { useWebdriverio } from "@/hooks";
import { ProCard } from "@ant-design/pro-components";
import { Button } from "antd";

export default function HomePage() {
  const { clickElement } = useWebdriverio();

  const interactWithElements = async () => {
    await clickElement('[data-testid="my-button"]');
  };

  return (
    <ProCard
      title={'Configs'}
      bordered
      headerBordered
    >
      <Button onClick={interactWithElements}>Test interaction</Button>
    </ProCard>
  );
}
