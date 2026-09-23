import type { WeatherDayRecord } from '@domain/weather/weatherDayRecord.ts';
import { Table } from 'antd';
import { useMemo } from 'react';

import { buildDayWindowColumns } from './dayWindowColumns.tsx';
import styles from './YearWindowTable.module.css';

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
