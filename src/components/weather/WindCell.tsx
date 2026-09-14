import { Typography } from 'antd';

import { formatWindSpeed } from './formatters.ts';
import { getNoDataLabel } from './noDataLabel.ts';
import styles from './weatherCells.module.css';

// eslint-disable-next-line @stylistic/max-len -- путь domain-модуля
import type { WeatherDayRecord } from '../../domain/weather/weatherDayRecord.ts';

const { Text } = Typography;

type WindCellProps = {
  record: WeatherDayRecord;
};

function getWindArrowRotation(degrees: number | undefined): number {
  if (degrees == null) {
    return 0;
  }

  return degrees;
}

export function WindCell({ record }: WindCellProps) {
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
}
