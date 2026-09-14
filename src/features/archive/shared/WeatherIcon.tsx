import {
  CloudOutlined,
  CloudSyncOutlined,
  QuestionCircleOutlined,
  SunOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { getWeatherIconKey } from '../../../utils/weatherCode';

type WeatherIconProps = {
  code: number | null;
};

export function WeatherIcon({ code }: WeatherIconProps) {
  const iconKey = getWeatherIconKey(code);

  switch (iconKey) {
    case 'clear':
    case 'mostly-clear':
      return <SunOutlined aria-hidden />;
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return iconKey === 'thunderstorm' ? <ThunderboltOutlined aria-hidden /> : <CloudSyncOutlined aria-hidden />;
    case 'snow':
      return <CloudOutlined aria-hidden />;
    case 'partly-cloudy':
    case 'cloudy':
    case 'fog':
      return <CloudOutlined aria-hidden />;
    default:
      return <QuestionCircleOutlined aria-hidden />;
  }
}
