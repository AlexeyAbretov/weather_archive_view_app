import styles from './DayWeatherCell.module.css';
import type { DayWeatherCellProps } from './DayWeatherCell.types';

import { PrecipitationCell } from '../PrecipitationCell';
import { TemperatureCell } from '../TemperatureCell';
import { WeatherIcon } from '../WeatherIcon';
import { WindCell } from '../WindCell';

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
