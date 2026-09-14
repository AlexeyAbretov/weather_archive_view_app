import { Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useCallback, useEffect, useState } from 'react';
import { useArchiveModeBData } from './useArchiveModeBData';
import { WeekRowExpanded } from './WeekRowExpanded';
import type { ArchiveModeBProps } from './types';

const { Text } = Typography;

export function YearRowsTable({ latitude, longitude, timezone, anchorDate }: ArchiveModeBProps) {
  const { years, loadYear, getEntry, getWeatherForDay } = useArchiveModeBData({
    latitude,
    longitude,
    timezone,
    anchorDate,
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState<number[]>([]);

  useEffect(() => {
    setExpandedRowKeys([]);
  }, [latitude, longitude, anchorDate]);

  const handleExpand = useCallback(
    (expanded: boolean, record: { year: number; unavailable: boolean }) => {
      if (expanded && !record.unavailable) {
        void loadYear(record.year);
      }
      setExpandedRowKeys((prev) =>
        expanded ? [...prev, record.year] : prev.filter((key) => key !== record.year),
      );
    },
    [loadYear],
  );

  const columns: ColumnsType<{ year: number; unavailable: boolean; key: number }> = [
    {
      title: 'Год',
      dataIndex: 'year',
      key: 'year',
      width: 100,
      fixed: 'left',
      render: (year: number) => <Text strong>{year}</Text>,
    },
    {
      title: 'Сводка',
      key: 'summary',
      render: (_, record) =>
        record.unavailable ? (
          <Text type="secondary">—</Text>
        ) : (
          <Text type="secondary">Раскройте строку для загрузки</Text>
        ),
    },
  ];

  const dataSource = years.map((item) => ({
    key: item.year,
    year: item.year,
    unavailable: item.unavailable,
  }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      expandable={{
        expandedRowKeys,
        onExpand: handleExpand,
        expandedRowRender: (record) => (
          <WeekRowExpanded
            year={record.year}
            anchorDate={anchorDate}
            entry={getEntry(record.year)}
            getWeatherForDay={getWeatherForDay}
            onRetry={() => void loadYear(record.year, false)}
          />
        ),
        rowExpandable: (record) => !record.unavailable,
      }}
      scroll={{ x: 'max-content' }}
      bordered
      size="small"
    />
  );
}
