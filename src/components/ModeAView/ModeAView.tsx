import { Alert, Button, Empty, Spin } from 'antd';

import type { ModeAViewProps } from './ModeAView.types';

import { YearWeatherTable } from '../YearWeatherTable';

export const ModeAView = ({
  data,
  error,
  loading,
  location,
  onReload,
}: ModeAViewProps) => {
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
          <Button size="small" onClick={onReload}>
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
