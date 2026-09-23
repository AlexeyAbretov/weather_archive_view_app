import { Typography } from 'antd';

import { formatTemperature } from './formatters.ts';
import { getNoDataLabel } from './noDataLabel.ts';
import styles from './weatherCells.module.css';

// eslint-disable-next-line @stylistic/max-len -- путь domain-модуля
import type { WeatherDayRecord } from '../../domain/weather/weatherDayRecord.ts';

const { Text } = Typography;

type TemperatureCellProps = {
  record: WeatherDayRecord;
};

export const TemperatureCell = ({ record }: TemperatureCellProps) => {
  if (!record.hasData) {
    return (
      <Text className={styles.noData} type="secondary">
        {getNoDataLabel(record.noDataReason)}
      </Text>
    );
  }

  return (
    <div className={styles.temperature}>
      <Text className={styles.tempMin}>
        {formatTemperature(record.tempMin)}
      </Text>
      <Text className={styles.tempSeparator}>/</Text>
      <Text className={styles.tempMax}>
        {formatTemperature(record.tempMax)}
      </Text>
    </div>
  );
};
