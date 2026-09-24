import { Typography } from 'antd';

import { formatPrecipitationMm, getNoDataLabel } from '@utils';

import styles from './PrecipitationCell.module.css';
import type { PrecipitationCellProps } from './PrecipitationCell.types';
import { getPrecipitationLabel } from './PrecipitationLabels';

const { Text } = Typography;

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
