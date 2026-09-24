import { Alert, Button, Empty, Segmented, Spin } from 'antd';
import { useState } from 'react';

import styles from './ModeAView.module.css';
import type { ModeAViewProps, YearTableLayout } from './ModeAView.types';

import { YearColumnsTable } from '../YearColumnsTable';
import { YearWeatherTable } from '../YearWeatherTable';

const LAYOUT_OPTIONS = [
  { label: 'Годы в строках', value: 'rows' as const },
  { label: 'Годы в заголовке', value: 'columns' as const },
];

export const ModeAView = ({
  anchorYear,
  data,
  error,
  loading,
  location,
  onReload,
}: ModeAViewProps) => {
  const [layout, setLayout] = useState<YearTableLayout>('rows');

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

  return (
    <div>
      <div className={`mode-switcher ${styles.layoutSwitcher}`}>
        <Segmented
          aria-label="Вид таблицы по годам"
          block
          options={LAYOUT_OPTIONS}
          value={layout}
          onChange={(nextValue) => {
            setLayout(nextValue as YearTableLayout);
          }}
        />
      </div>
      {layout === 'rows' ? (
        <YearWeatherTable
          anchorYear={anchorYear}
          data={data}
          loading={loading}
        />
      ) : (
        <YearColumnsTable
          anchorYear={anchorYear}
          data={data}
          loading={loading}
        />
      )}
    </div>
  );
};
