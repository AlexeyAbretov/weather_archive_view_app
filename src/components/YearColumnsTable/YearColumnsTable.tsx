import { Table, Typography } from 'antd';
import { useMemo } from 'react';

import { buildYearColumnHeaders, YEAR_METRIC_ROWS } from './YearColumnHeaders';
import styles from './YearColumnsTable.module.css';
import type { YearColumnsTableProps } from './YearColumnsTable.types';

const { Text } = Typography;

export const YearColumnsTable = ({
  anchorYear,
  data,
  loading = false,
}: YearColumnsTableProps) => {
  const columns = useMemo(
    () => buildYearColumnHeaders(data, anchorYear),
    [anchorYear, data],
  );
  const rows = data.length === 0 ? [] : YEAR_METRIC_ROWS;

  return (
    <div>
      <Text className="table-scroll-hint" type="secondary">
        Прокрутите таблицу влево или вправо, чтобы увидеть все годы.
      </Text>
      <div className={`table-wrapper ${styles.tableWrapper}`}>
        <Table
          className={styles.table}
          columns={columns}
          dataSource={rows}
          loading={loading}
          pagination={false}
          rowKey="key"
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </div>
    </div>
  );
};
