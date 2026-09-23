import { Table } from 'antd';
import { useMemo } from 'react';

import { buildDayWindowColumns } from './dayWindowColumns.tsx';
import styles from './YearWindowTable.module.css';

// eslint-disable-next-line @stylistic/max-len -- путь domain-модуля
import type { WeatherDayRecord } from '../../../domain/weather/weatherDayRecord.ts';

type DayWindowRow = {
  key: string;
};

type DayWindowTableProps = {
  days: WeatherDayRecord[];
};

export const DayWindowTable = ({ days }: DayWindowTableProps) => {
  const columns = useMemo(() => buildDayWindowColumns(days), [days]);
  const dataSource = useMemo<DayWindowRow[]>(() => [{ key: 'window' }], []);

  return (
    <div className={styles.expandedWrapper}>
      <Table<DayWindowRow>
        bordered
        className={styles.expandedTable}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        rowKey="key"
        scroll={{ x: 'max-content' }}
        showHeader
        size="small"
      />
    </div>
  );
};
