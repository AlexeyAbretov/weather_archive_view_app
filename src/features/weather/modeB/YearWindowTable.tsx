import { getNoDataLabel } from '@components/weather/noDataLabel.ts';
import { Alert, Button, Spin, Table, Typography } from 'antd';
import type { Key } from 'react';
import { useMemo } from 'react';

import { DayWindowTable } from './DayWindowTable.tsx';
import styles from './YearWindowTable.module.css';

// eslint-disable-next-line @stylistic/max-len -- путь domain-модуля
import type { YearWeatherWindow } from '../../../domain/weather/weatherDayRecord.ts';

const { Text } = Typography;

type YearRow = {
  year: number;
  expandable: boolean;
};

type YearWindowTableProps = {
  years: number[];
  windowsByYear: ReadonlyMap<number, YearWeatherWindow>;
  loadingYears: ReadonlySet<number>;
  errorYears: ReadonlyMap<number, Error>;
  expandedYears: number[];
  onExpandedYearsChange: (years: number[]) => void;
  onExpandYear: (year: number) => void;
  onRetryYear: (year: number) => void;
  isYearExpandable: (year: number) => boolean;
};

export const YearWindowTable = ({
  years,
  windowsByYear,
  loadingYears,
  errorYears,
  expandedYears,
  onExpandedYearsChange,
  onExpandYear,
  onRetryYear,
  isYearExpandable,
}: YearWindowTableProps) => {
  const dataSource = useMemo<YearRow[]>(
    () =>
      years.map((year) => ({
        year,
        expandable: isYearExpandable(year),
      })),
    [isYearExpandable, years],
  );

  const handleExpandedRowsChange = (keys: readonly Key[]) => {
    const nextYears = keys.map((key) => Number(key));

    onExpandedYearsChange(nextYears);

    nextYears.forEach((year) => {
      if (!windowsByYear.has(year) && !loadingYears.has(year)) {
        onExpandYear(year);
      }
    });
  };

  return (
    <div>
      <Text className="table-scroll-hint" type="secondary">
        Раскройте строку года, чтобы увидеть 15 дней вокруг якорной даты.
        Прокрутите вложенную таблицу для просмотра всех дней.
      </Text>
      <div className={`table-wrapper ${styles.tableWrapper}`}>
        <Table<YearRow>
          bordered
          className={styles.table}
          columns={[
            {
              title: 'Год',
              dataIndex: 'year',
              key: 'year',
              width: 120,
              align: 'center',
              fixed: 'left',
              render: (year: number, row) => (
                <div>
                  <div className={styles.yearCell}>{year}</div>
                  {!row.expandable && (
                    <Text className={styles.unavailableYear} type="secondary">
                      {getNoDataLabel('feb29')}
                    </Text>
                  )}
                </div>
              ),
            },
          ]}
          dataSource={dataSource}
          expandable={{
            expandedRowKeys: expandedYears,
            onExpandedRowsChange: handleExpandedRowsChange,
            rowExpandable: (row) => row.expandable,
            expandedRowRender: (row) => {
              const year = row.year;

              if (errorYears.has(year)) {
                return (
                  <div className={styles.expandedState}>
                    <Alert
                      action={
                        <Button size="small" onClick={() => onRetryYear(year)}>
                          Повторить
                        </Button>
                      }
                      message="Не удалось загрузить данные года"
                      showIcon
                      type="error"
                    />
                  </div>
                );
              }

              if (loadingYears.has(year) || !windowsByYear.has(year)) {
                return (
                  <div className={styles.expandedState}>
                    <Spin tip="Загрузка данных года…" />
                  </div>
                );
              }

              return <DayWindowTable days={windowsByYear.get(year)!.days} />;
            },
          }}
          pagination={false}
          rowKey="year"
          scroll={{ x: 'max-content' }}
          size="small"
        />
      </div>
    </div>
  );
};
