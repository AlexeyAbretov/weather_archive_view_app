import type { WeatherDayRecord } from '@domain/weather/weatherDayRecord.ts';

import { PrecipitationCell } from './PrecipitationCell.tsx';
import { TemperatureCell } from './TemperatureCell.tsx';
import styles from './weatherCells.module.css';
import { WeatherIcon } from './WeatherIcon.tsx';
import { WindCell } from './WindCell.tsx';

type DayWeatherCellProps = {
  record: WeatherDayRecord;
};

export const DayWeatherCell = ({ record }: DayWeatherCellProps) => {
  return (
    <div className={styles.dayWeatherCell}>
      <TemperatureCell record={record} />
      <PrecipitationCell record={record} />
      <WindCell record={record} />
      <WeatherIcon record={record} />
    </div>
  );
};
