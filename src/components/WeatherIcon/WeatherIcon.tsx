import { Typography } from 'antd';

import { mapWeatherCode } from '@domain';
import { getNoDataLabel } from '@utils';

import styles from './WeatherIcon.module.css';
import type { WeatherIconProps } from './WeatherIcon.types';
import { resolveWeatherPicture } from './WeatherIcon.utils';
import { WeatherPicture } from './WeatherPicture';

const { Text } = Typography;

export const WeatherIcon = ({ record }: WeatherIconProps) => {
  if (!record.hasData) {
    return (
      <Text className={styles.noData} type="secondary">
        {getNoDataLabel(record.noDataReason)}
      </Text>
    );
  }

  const info = mapWeatherCode(record.weatherCode);
  const picture = resolveWeatherPicture(record);

  return (
    <div className={styles.weatherIcon} title={info.description}>
      <WeatherPicture {...picture} />
      {record.cloudCover != null ? (
        <Text className={styles.cloudCover} type="secondary">
          {Math.round(record.cloudCover)}%
        </Text>
      ) : null}
    </div>
  );
};
