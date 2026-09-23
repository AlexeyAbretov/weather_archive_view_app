import { Space, Typography } from 'antd';

import { WeatherViewPage } from '@features';

const { Paragraph } = Typography;

export const HomePage = () => {
  return (
    <Space className="filter-bar" direction="vertical" size="large">
      <Paragraph style={{ marginBottom: 0 }}>
        Сравнение погоды в выбранном городе по одной якорной дате на горизонте
        ±10 лет.
      </Paragraph>
      <WeatherViewPage />
    </Space>
  );
};
