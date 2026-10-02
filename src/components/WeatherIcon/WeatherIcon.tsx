import { Typography } from 'antd';

import { getNoDataLabel } from '@utils';

import styles from './WeatherIcon.module.css';
import type { WeatherIconProps } from './WeatherIcon.types';
import { formatWeatherTitle, resolveWeatherPicture } from './WeatherIcon.utils';
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

  const picture = resolveWeatherPicture(record);
  const title = formatWeatherTitle(
    picture.sky,
    picture.precipitation,
    picture.intensity,
  );

  return (
    <div className={styles.weatherIcon} title={title}>
      <WeatherPicture {...picture} />
      {record.cloudCover != null ? (
        <Text className={styles.cloudCover} type="secondary">
          {Math.round(record.cloudCover)}%
        </Text>
      ) : null}
    </div>
  );
};
