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

export function WeatherViewPage() {
  const { location } = useSelectedLocation();
  const { anchorDate, setAnchorDate, yearRangeLabel } = useWeatherAppState();
  const [viewMode, setViewMode] = useState<ViewMode>('A');

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <div>
        <Title level={4}>Город</Title>
        <CitySelector />
      </div>

      <div>
        <Title level={4}>Якорная дата</Title>
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

      <div>
        <Title level={4}>Режим просмотра</Title>
        <ModeSwitcher onChange={setViewMode} value={viewMode} />
      </div>

      <div>
        {viewMode === 'A' ? (
          <ModeAView anchorDate={anchorDate} location={location} />
        ) : (
          <ModeBView anchorDate={anchorDate} location={location} />
        )}
      </div>
    </Space>
  );
}
