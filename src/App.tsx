import { HomePage } from '@pages/HomePage.tsx';
import { Layout, Typography } from 'antd';

import { CloudOutlined } from '@ant-design/icons';

const { Content, Footer, Header } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header className="app-header">
        <CloudOutlined
          style={{ fontSize: 24, marginRight: 12, flexShrink: 0 }}
        />
        <Title className="app-header-title" level={4}>
          Архив погоды
        </Title>
      </Header>
      <Content className="app-content">
        <HomePage />
      </Content>
      <Footer className="app-footer">
        Данные:{' '}
        <a
          href="https://open-meteo.com/en/docs/historical-weather-api"
          rel="noopener noreferrer"
          target="_blank"
        >
          Open-Meteo Archive API
        </a>
      </Footer>
    </Layout>
  );
};

export default App;
