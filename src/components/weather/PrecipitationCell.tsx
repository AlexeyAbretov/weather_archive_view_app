import { Typography } from 'antd';

import { formatPrecipitationMm } from './formatters.ts';
import { getNoDataLabel } from './noDataLabel.ts';
import { getPrecipitationLabel } from './precipitationLabels.ts';
import styles from './weatherCells.module.css';

// eslint-disable-next-line @stylistic/max-len -- путь domain-модуля
import type { WeatherDayRecord } from '../../domain/weather/weatherDayRecord.ts';

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
