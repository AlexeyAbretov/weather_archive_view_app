import { Table } from 'antd';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';

import { buildDayWindowColumns, DAY_METRIC_ROWS } from './DayWindowColumns';
import styles from './YearWindowTable.module.css';
import type {
  DayWindowRow,
  DayWindowTableProps,
} from './YearWindowTable.types';

const findScroller = (root: HTMLElement): HTMLElement | null => {
  return root.querySelector<HTMLElement>('.ant-table-content');
};

export const DayWindowTable = ({ days, scrollSync }: DayWindowTableProps) => {
  const columns = useMemo(() => buildDayWindowColumns(days), [days]);
  const dataSource = useMemo<DayWindowRow[]>(
    () => (days.length === 0 ? [] : DAY_METRIC_ROWS),
    [days.length],
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const scroller = findScroller(root);

    if (!scroller) {
      return;
    }

    const unregister = scrollSync.register(scroller);

    const handleScroll = () => {
      scrollSync.syncFrom(scroller);
    };

    scroller.addEventListener('scroll', handleScroll);

    return () => {
      scroller.removeEventListener('scroll', handleScroll);
      unregister();
    };
  }, [days, scrollSync]);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const scroller = findScroller(root);

    if (!scroller) {
      return;
    }

    let nestedFrame = 0;
    const frame = requestAnimationFrame(() => {
      scrollSync.align(scroller);
      nestedFrame = requestAnimationFrame(() => {
        scrollSync.releaseEcho(scroller);
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(nestedFrame);
    };
  }, [days, scrollSync]);

  return (
    <div ref={rootRef} className={styles.expandedWrapper}>
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
