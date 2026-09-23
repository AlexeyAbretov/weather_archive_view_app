import { Typography } from 'antd';

import type { WeatherDayRecord } from '@domain';

import { formatWindSpeed } from './formatters';
import { getNoDataLabel } from './noDataLabel';
import styles from './weatherCells.module.css';

const { Text } = Typography;

type WindCellProps = {
  record: WeatherDayRecord;
};

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
