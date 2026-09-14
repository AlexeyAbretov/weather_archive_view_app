import { Space, Typography } from 'antd';

import { WeatherViewPage } from '../features/weather/WeatherViewPage.tsx';

const { Paragraph } = Typography;

export function HomePage() {
  return (
    <Space className="filter-bar" direction="vertical" size="large">
      <Paragraph style={{ marginBottom: 0 }}>
        Сравнение погоды в выбранном городе по одной якорной дате на горизонте
        ±10 лет.
      </Paragraph>
      <WeatherViewPage />
    </Space>
  );
}
