import { Typography } from 'antd';

import type { WeatherDayRecord } from '@domain';

import { formatTemperature } from './formatters';
import { getNoDataLabel } from './noDataLabel';
import styles from './weatherCells.module.css';

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
