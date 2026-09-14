import type { ReactNode } from 'react';
import { CloudOutlined } from '@ant-design/icons';
import { Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <Layout style={{ minHeight: '100%' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#001529',
        }}
      >
        <CloudOutlined style={{ fontSize: 24, color: '#fff' }} />
        <Title level={4} style={{ margin: 0, color: '#fff' }}>
          Архив погоды
        </Title>
      </Header>
      <Content style={{ padding: '24px 16px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        {children}
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Данные: Open-Meteo Archive API
      </Footer>
    </Layout>
  );
}
