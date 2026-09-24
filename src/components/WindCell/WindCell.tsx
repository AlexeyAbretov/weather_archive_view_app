import { Typography } from 'antd';

import { formatWindSpeed, getNoDataLabel } from '@utils';

import styles from './WindCell.module.css';
import type { WindCellProps } from './WindCell.types';

const { Text } = Typography;

const getWindArrowRotation = (degrees: number | undefined): number => {
  if (degrees == null) {
    return 0;
  }

  return degrees;
};

export const WindCell = ({ record }: WindCellProps) => {
  if (!record.hasData) {
    return (
      <Text className={styles.noData} type="secondary">
        {getNoDataLabel(record.noDataReason)}
      </Text>
    );
  }

  const rotation = getWindArrowRotation(record.windDirection);

  return (
    <div className={styles.wind}>
      <span
        aria-hidden
        className={styles.windArrow}
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        ↑
      </span>
      <Text>{formatWindSpeed(record.windSpeedMax)}</Text>
    </div>
  );
};
