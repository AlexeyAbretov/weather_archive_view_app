import { useModeAWeather } from '@hooks/useModeAWeather.ts';
import { Alert, Button, Empty, Spin } from 'antd';
import { useMemo } from 'react';

import type { AnchorDate } from '@types';

import { YearWeatherTable } from './YearWeatherTable.tsx';

import { toDayjs } from '../../../lib/date/anchorDate.ts';
import type { SelectedLocation } from '../../location/types.ts';

type ModeAViewProps = {
  location: SelectedLocation | null;
  anchorDate: AnchorDate;
};

export const ModeAView = ({ location, anchorDate }: ModeAViewProps) => {
  const anchorDayjs = useMemo(() => toDayjs(anchorDate), [anchorDate]);

  const { data, loading, error, reload } = useModeAWeather({
    lat: location?.lat ?? null,
    lon: location?.lon ?? null,
    anchorDate: anchorDayjs,
    enabled: location != null,
  });

  if (!location) {
    return (
      <Empty
        description="Выберите город и дату для просмотра архива"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  if (error) {
    return (
      <Alert
        action={
          <Button size="small" onClick={reload}>
            Повторить
          </Button>
        }
        message="Не удалось загрузить данные"
        showIcon
        type="error"
      />
    );
  }

  if (loading && data.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <Spin size="large" tip="Загрузка архива погоды…" />
      </div>
    );
  }

  return <YearWeatherTable data={data} loading={loading} />;
};
