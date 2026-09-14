import { Layout, Typography } from 'antd';

import { CloudOutlined } from '@ant-design/icons';

import { HomePage } from './pages/HomePage.tsx';

const { Content, Footer, Header } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <CloudOutlined style={{ fontSize: 24, marginRight: 12 }} />
        <Title level={4} style={{ color: '#fff', margin: 0 }}>
          Архив погоды
        </Title>
      </Header>
      <Content style={{ padding: '24px 48px' }}>
        <HomePage />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Архив погоды · выбор города и якорной даты
      </Footer>
    </Layout>
  );
}

export default App;
