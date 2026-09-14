import { Typography } from 'antd';

import { CitySelector } from '../features/location/CitySelector';

const { Paragraph, Title } = Typography;

export function HomePage() {
  return (
    <>
      <Title level={2}>Выбор города</Title>
      <Paragraph>
        Найдите город через поиск или определите текущее местоположение.
        Координаты будут использованы для запросов к архиву погоды.
      </Paragraph>
      <CitySelector />
    </>
  );
}
