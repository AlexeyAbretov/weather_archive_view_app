import { Space, Typography } from 'antd';
import { useState } from 'react';

import { AnchorDatePicker, ModeSwitcher, type ViewMode } from '@components';
import {
  CitySelectorContainer,
  ModeAViewContainer,
  ModeBViewContainer,
} from '@containers';
import { useWeatherAppState } from '@hooks';
import { formatAnchorDate, readViewMode, saveViewMode } from '@utils';

const { Paragraph, Text, Title } = Typography;

export const HomePage = () => {
  const { anchorDate, setAnchorDate, yearRangeLabel } = useWeatherAppState();
  const [viewMode, setViewMode] = useState<ViewMode>(
    () => readViewMode() ?? 'A',
  );

  const handleViewModeChange = (mode: ViewMode) => {
    saveViewMode(mode);
    setViewMode(mode);
  };

  return (
    <Space className="filter-bar" direction="vertical" size={0}>
      <Paragraph style={{ marginBottom: 0 }}>
        Сравнение погоды в выбранном городе по одной якорной дате: 10 лет до неё
        и до 10 лет после, не позже текущего года.
      </Paragraph>

      <div className="filter-section">
        <Title level={4}>Город</Title>
        <CitySelectorContainer />
      </div>

      <div className="filter-section">
        <Space
          align="baseline"
          className="filter-controls anchor-date-row"
          size="middle"
          wrap
        >
          <Title className="anchor-date-label" level={4}>
            Якорная дата
          </Title>
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
        <ModeSwitcher onChange={handleViewModeChange} value={viewMode} />
      </div>

      <div className="filter-section">
        {viewMode === 'A' ? (
          <ModeAViewContainer anchorDate={anchorDate} />
        ) : (
          <ModeBViewContainer anchorDate={anchorDate} />
        )}
      </div>
    </Space>
  );
};
