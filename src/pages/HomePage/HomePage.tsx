import { Space, Typography } from 'antd';
import { useState } from 'react';

import {
  AnchorDatePicker,
  CitySelector,
  ModeAView,
  ModeBView,
  ModeSwitcher,
  type ViewMode,
} from '@components';
import { useSelectedLocation, useWeatherAppState } from '@hooks';
import { formatAnchorDate } from '@utils';

const { Paragraph, Text, Title } = Typography;

export const HomePage = () => {
  const { location } = useSelectedLocation();
  const { anchorDate, setAnchorDate, yearRangeLabel } = useWeatherAppState();
  const [viewMode, setViewMode] = useState<ViewMode>('A');

  return (
    <Space className="filter-bar" direction="vertical" size="large">
      <Paragraph style={{ marginBottom: 0 }}>
        Сравнение погоды в выбранном городе по одной якорной дате на горизонте
        ±10 лет.
      </Paragraph>

      <div className="filter-section">
        <Title level={4}>Город</Title>
        <CitySelector />
      </div>

      <div className="filter-section">
        <Title level={4}>Якорная дата</Title>
        <Space className="filter-controls" direction="vertical" size="middle">
          <AnchorDatePicker onChange={setAnchorDate} value={anchorDate} />
          <Text>
            Выбранная дата: <Text strong>{formatAnchorDate(anchorDate)}</Text>
          </Text>
          <Text>
            Диапазон лет: <Text strong>{yearRangeLabel}</Text>
          </Text>
        </Space>
      </div>

      <div className="filter-section">
        <Title level={4}>Режим просмотра</Title>
        <ModeSwitcher onChange={setViewMode} value={viewMode} />
      </div>

      <div className="filter-section">
        {viewMode === 'A' ? (
          <ModeAView anchorDate={anchorDate} location={location} />
        ) : (
          <ModeBView anchorDate={anchorDate} location={location} />
        )}
      </div>
    </Space>
  );
};
