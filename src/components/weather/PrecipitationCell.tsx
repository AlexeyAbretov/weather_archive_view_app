import { Typography } from 'antd';

import type { WeatherDayRecord } from '@domain';

import { formatPrecipitationMm } from './formatters';
import { getNoDataLabel } from './noDataLabel';
import { getPrecipitationLabel } from './precipitationLabels';
import styles from './weatherCells.module.css';

const { Text } = Typography;

type PrecipitationCellProps = {
  record: WeatherDayRecord;
};

export const PrecipitationCell = ({ record }: PrecipitationCellProps) => {
  if (!record.hasData) {
    return (
      <Text className={styles.noData} type="secondary">
        {getNoDataLabel(record.noDataReason)}
      </Text>
    );
  }

  const typeLabel = getPrecipitationLabel(record.precipitationType);
  const mmLabel = formatPrecipitationMm(record.precipitationMm);

  return (
    <div className={styles.precipitation}>
      <Text>{typeLabel}</Text>
      <Text className={styles.precipitationMm} type="secondary">
        {mmLabel}
      </Text>
    </div>
  );
};
