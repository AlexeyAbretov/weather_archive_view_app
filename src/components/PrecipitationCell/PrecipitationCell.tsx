import { Typography } from 'antd';

import { formatPrecipitationMm, getNoDataLabel } from '@utils';

import styles from './PrecipitationCell.module.css';
import type { PrecipitationCellProps } from './PrecipitationCell.types';

const { Text } = Typography;

export const PrecipitationCell = ({ record }: PrecipitationCellProps) => {
  if (!record.hasData) {
    return (
      <Text className={styles.noData} type="secondary">
        {getNoDataLabel(record.noDataReason)}
      </Text>
    );
  }

  return <Text>{formatPrecipitationMm(record.precipitationMm)}</Text>;
};
