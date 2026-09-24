import { Table, Typography } from 'antd';
import { useMemo } from 'react';

import type { YearWeatherRow } from '@domain';

import { buildYearTableColumns } from './YearTableColumns';
import styles from './YearWeatherTable.module.css';
import type { YearWeatherTableProps } from './YearWeatherTable.types';

const { Text } = Typography;

export const YearWeatherTable = ({
  anchorYear,
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
          rowClassName={(record) => {
            if (record.year !== anchorYear) {
              return '';
            }

            return styles.anchorRow;
          }}
          rowKey="year"
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </div>
    </div>
  );
};
