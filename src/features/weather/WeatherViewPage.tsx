import { Space, Typography } from 'antd';
import { useState } from 'react';

import { ModeAView } from './modeA/ModeAView.tsx';
import { ModeBView } from './modeB/ModeBView.tsx';
import { ModeSwitcher, type ViewMode } from './ModeSwitcher.tsx';

import { formatAnchorDate } from '../../lib/date/anchorDate.ts';
import { useWeatherAppState } from '../../state/useWeatherAppState.ts';
import { AnchorDatePicker } from '../anchor-date/AnchorDatePicker.tsx';
import { CitySelector } from '../location/CitySelector.tsx';
import { useSelectedLocation } from '../location/LocationProvider.tsx';

const { Text, Title } = Typography;

export const WeatherViewPage = () => {
  const { location } = useSelectedLocation();
  const { anchorDate, setAnchorDate, yearRangeLabel } = useWeatherAppState();
  const [viewMode, setViewMode] = useState<ViewMode>('A');

  return (
    <Space className="filter-bar" direction="vertical" size="large">
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
