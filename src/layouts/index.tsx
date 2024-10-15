import { PageContainer } from '@ant-design/pro-components';
import { history, Outlet, useLocation } from '@umijs/max';
import { Button, Space } from 'antd';

export default function Layout() {
  const { pathname } = useLocation();
  const themeTest = pathname.includes('Counter') ? 'primary' : 'default';

  const themeI18n = pathname === '/' ? 'primary' : 'default';

  return (
    <PageContainer title={pathname}>
      <Space className="py-4">
        <Button onClick={() => history.push('/')} type={themeI18n}>
          I18n
        </Button>
        <Button onClick={() => history.push('/Counter')} type={themeTest}>
          Test
        </Button>
      </Space>
      <Outlet />
    </PageContainer>
  );
}
