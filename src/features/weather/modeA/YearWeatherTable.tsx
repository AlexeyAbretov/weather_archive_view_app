import { Table, Typography } from 'antd';
import { useMemo } from 'react';

import type { YearWeatherRow } from '@domain';

import { buildYearTableColumns } from './yearTableColumns';
import styles from './YearWeatherTable.module.css';

const { Text } = Typography;

type YearWeatherTableProps = {
  data: YearWeatherRow[];
  loading?: boolean;
};

export const YearWeatherTable = ({
  data,
  loading = false,
}: YearWeatherTableProps) => {
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
};
