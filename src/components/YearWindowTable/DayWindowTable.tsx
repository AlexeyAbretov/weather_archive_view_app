import { Table } from 'antd';
import { useMemo } from 'react';

import { buildDayWindowColumns, DAY_METRIC_ROWS } from './DayWindowColumns';
import styles from './YearWindowTable.module.css';
import type {
  DayWindowRow,
  DayWindowTableProps,
} from './YearWindowTable.types';

export const DayWindowTable = ({ days }: DayWindowTableProps) => {
  const columns = useMemo(() => buildDayWindowColumns(days), [days]);
  const dataSource = useMemo<DayWindowRow[]>(
    () => (days.length === 0 ? [] : DAY_METRIC_ROWS),
    [days.length],
  );

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
