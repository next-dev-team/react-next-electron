import { PageContainer } from '@ant-design/pro-components';
import { Outlet, useLocation } from '@umijs/max';

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <PageContainer title={pathname}>
      <Outlet />
    </PageContainer>
  );
}
