import { Space, Typography } from 'antd';

import { WeatherViewPage } from '../features/weather/WeatherViewPage.tsx';

const { Paragraph, Title } = Typography;

export function HomePage() {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Архив погоды</Title>
        <Paragraph>
          Сравнение погоды в выбранном городе по одной якорной дате на горизонте
          ±10 лет. Данные Open-Meteo Archive.
        </Paragraph>
      </div>
      <WeatherViewPage />
    </Space>
  );
}
