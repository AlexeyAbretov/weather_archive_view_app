import { Typography } from 'antd';

import { formatTemperature, getNoDataLabel } from '@utils';

import styles from './TemperatureCell.module.css';
import type { TemperatureCellProps } from './TemperatureCell.types';

const { Text } = Typography;

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
