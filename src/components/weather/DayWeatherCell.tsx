import type { WeatherDayRecord } from '@domain';

import { PrecipitationCell } from './PrecipitationCell';
import { TemperatureCell } from './TemperatureCell';
import styles from './weatherCells.module.css';
import { WeatherIcon } from './WeatherIcon';
import { WindCell } from './WindCell';

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
