import { Button, Layout, Typography } from 'antd';

import { CloudOutlined } from '@ant-design/icons';

const { Content, Footer, Header } = Layout;
const { Paragraph, Title } = Typography;

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
        <Title level={2}>Добро пожаловать</Title>
        <Paragraph>
          PWA-приложение для просмотра архива погоды по данным Open-Meteo. Выбор
          города, даты и режимы отображения будут добавлены на следующих этапах
          MVP.
        </Paragraph>
        <Button type="primary">Начать работу</Button>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Архив погоды · этап 0 — bootstrap
      </Footer>
    </Layout>
  );
}

export default App;
