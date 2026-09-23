import { Space, Typography } from 'antd';
import { useState } from 'react';

import { formatAnchorDate } from '@lib';
import { useWeatherAppState } from '@state';

import { ModeAView } from './modeA/ModeAView';
import { ModeBView } from './modeB/ModeBView';
import { ModeSwitcher, type ViewMode } from './ModeSwitcher';

import { AnchorDatePicker } from '../anchor-date/AnchorDatePicker';
import { CitySelector } from '../location/CitySelector';
import { useSelectedLocation } from '../location/LocationProvider';

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
