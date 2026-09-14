import { Table, Typography } from 'antd';
import { useMemo } from 'react';

import { buildYearTableColumns } from './yearTableColumns.tsx';
import styles from './YearWeatherTable.module.css';

// eslint-disable-next-line @stylistic/max-len -- путь domain-модуля
import type { YearWeatherRow } from '../../../domain/weather/weatherDayRecord.ts';

const { Text } = Typography;

type YearWeatherTableProps = {
  data: YearWeatherRow[];
  loading?: boolean;
};

export function YearWeatherTable({
  data,
  loading = false,
}: YearWeatherTableProps) {
  const columns = useMemo(() => buildYearTableColumns(), []);

  return (
    <div>
      <Text className="table-scroll-hint" type="secondary">
        Прокрутите таблицу влево или вправо, чтобы увидеть все колонки.
      </Text>
      <div className={`table-wrapper ${styles.tableWrapper}`}>
        <Table<YearWeatherRow>
          className={styles.table}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={false}
          rowKey="year"
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </div>
    </div>
  );
}
