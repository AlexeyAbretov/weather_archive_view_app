import { Space, Tooltip, Typography } from 'antd';
import type { DailyWeather } from '../../../domain/dailyWeather';
import {
  formatTemperature,
  formatWindDirection,
  getPrecipitationLabel,
} from '../../../utils/weatherCode';
import { WeatherIcon } from './WeatherIcon';

const { Text } = Typography;

type DayWeatherCellProps = {
  weather: DailyWeather | null | undefined;
  unavailableReason?: string;
};

export function DayWeatherCell({ weather, unavailableReason }: DayWeatherCellProps) {
  if (!weather) {
    const content = <Text type="secondary">—</Text>;
    return unavailableReason ? <Tooltip title={unavailableReason}>{content}</Tooltip> : content;
  }

  const hasData =
    weather.temperatureMin !== null ||
    weather.temperatureMax !== null ||
    weather.weatherCode !== null;

  if (!hasData) {
    return <Text type="secondary">—</Text>;
  }

  const precipitationType = getPrecipitationLabel(
    weather.weatherCode,
    weather.rainSum,
    weather.snowfallSum,
  );
  const precipitationMm =
    weather.precipitationSum !== null ? `${weather.precipitationSum.toFixed(1)} мм` : '—';
  const windSpeed =
    weather.windSpeedMax !== null ? `${Math.round(weather.windSpeedMax)} м/с` : '';
  const windDir = formatWindDirection(weather.windDirection);
  const windText = [windSpeed, windDir].filter(Boolean).join(', ') || '—';

  return (
    <Space direction="vertical" size={2} style={{ minWidth: 72, textAlign: 'center' }}>
      <WeatherIcon code={weather.weatherCode} />
      <Text>
        {formatTemperature(weather.temperatureMax)} / {formatTemperature(weather.temperatureMin)}
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {precipitationType}, {precipitationMm}
      </Text>
      <Text type="secondary" style={{ fontSize: 12 }}>
        {windText}
      </Text>
    </Space>
  );
}
