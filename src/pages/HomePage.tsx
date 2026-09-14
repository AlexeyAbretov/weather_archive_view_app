import { Space, Typography } from 'antd';

import { AnchorDatePicker } from '../features/anchor-date/AnchorDatePicker.tsx';
import { formatAnchorDate } from '../lib/date/anchorDate.ts';
import { useWeatherAppState } from '../state/useWeatherAppState.ts';

const { Paragraph, Text, Title } = Typography;

export function HomePage() {
  const { anchorDate, setAnchorDate, yearRangeLabel } = useWeatherAppState();

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={2}>Добро пожаловать</Title>
        <Paragraph>
          PWA-приложение для просмотра архива погоды по данным Open-Meteo.
          Выберите якорную дату — от неё рассчитывается диапазон ±10 лет для
          режимов A и B.
        </Paragraph>
      </div>
      <div>
        <Title level={4}>Дата</Title>
        <Space direction="vertical" size="middle">
          <AnchorDatePicker onChange={setAnchorDate} value={anchorDate} />
          <Text>
            Выбранная дата: <Text strong>{formatAnchorDate(anchorDate)}</Text>
          </Text>
          <Text>
            Диапазон лет: <Text strong>{yearRangeLabel}</Text>
          </Text>
        </Space>
      </div>
    </Space>
  );
}
