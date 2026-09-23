import type { WeatherDayRecord } from '@domain/weather/weatherDayRecord.ts';
import { Typography } from 'antd';

import { formatWindSpeed } from './formatters.ts';
import { getNoDataLabel } from './noDataLabel.ts';
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
