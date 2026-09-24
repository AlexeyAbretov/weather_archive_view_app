import '@ant-design/v5-patch-for-react-19';
import './index.css';

import { ConfigProvider, Layout, Typography } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { CloudOutlined } from '@ant-design/icons';
import { HomePage } from '@pages';
import { LocationProvider, WeatherAppProvider } from '@providers';

const { Content, Header } = Layout;
const { Title } = Typography;

const App = () => {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        components: {
          Layout: {
            headerColor: '#fff',
          },
        },
      }}
    >
      <WeatherAppProvider>
        <LocationProvider>
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
          </Layout>
        </LocationProvider>
      </WeatherAppProvider>
    </ConfigProvider>
  );
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Корневой элемент #root не найден');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
