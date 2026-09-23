import { mapWeatherCode } from '@domain/weather/weatherCodeCatalog.ts';
import type { WeatherDayRecord } from '@domain/weather/weatherDayRecord.ts';
import { Typography } from 'antd';

import {
  CloudOutlined,
  QuestionCircleOutlined,
  SunOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';

import { getNoDataLabel } from './noDataLabel.ts';
import styles from './weatherCells.module.css';

const { Text } = Typography;

type WeatherIconProps = {
  record: WeatherDayRecord;
};

const resolveIcon = (iconKey: string | undefined) => {
  switch (iconKey) {
    case 'clear':
    case 'mainly-clear':
      return <SunOutlined className={styles.iconClear} />;
    case 'rain':
    case 'rain-showers':
    case 'freezing-rain':
    case 'drizzle':
    case 'freezing-drizzle':
      return <CloudOutlined className={styles.iconRain} />;
    case 'snow':
    case 'snow-showers':
      return <CloudOutlined className={styles.iconSnow} />;
    case 'thunderstorm':
    case 'thunderstorm-hail':
      return <ThunderboltOutlined className={styles.iconStorm} />;
    case 'fog':
    case 'overcast':
    case 'partly-cloudy':
      return <CloudOutlined className={styles.iconCloud} />;
    default:
      return <QuestionCircleOutlined className={styles.iconUnknown} />;
  }
};

export const WeatherIcon = ({ record }: WeatherIconProps) => {
  if (!record.hasData) {
    return (
      <Text className={styles.noData} type="secondary">
        {getNoDataLabel(record.noDataReason)}
      </Text>
    );
  }

  const info = mapWeatherCode(record.weatherCode);
  const icon = resolveIcon(record.iconKey ?? info.iconKey);

  return (
    <div className={styles.weatherIcon} title={info.description}>
      {icon}
      {record.cloudCover != null ? (
        <Text className={styles.cloudCover} type="secondary">
          {Math.round(record.cloudCover)}%
        </Text>
      ) : null}
    </div>
  );
};
