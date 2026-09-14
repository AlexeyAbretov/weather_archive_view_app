import { CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Card, Space, Typography } from 'antd';

const { Paragraph, Text } = Typography;

export function HomePage() {
  return (
    <Card title="Главная">
      <Space direction="vertical" size="middle">
        <Paragraph style={{ marginBottom: 0 }}>
          Приложение для просмотра архива погоды за выбранный день по годам.
        </Paragraph>
        <Text type="secondary">
          <EnvironmentOutlined /> Выберите город и дату — функциональность будет добавлена на
          следующих этапах MVP.
        </Text>
        <Text type="secondary">
          <CalendarOutlined /> Режимы сравнения по годам (A и B) появятся после подключения API.
        </Text>
      </Space>
    </Card>
  );
}
