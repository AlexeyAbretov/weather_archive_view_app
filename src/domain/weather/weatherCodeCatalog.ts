import type { PrecipitationType } from './weatherDayRecord.ts';

export type WeatherCodeInfo = {
  description: string;
  precipitationType: PrecipitationType;
  iconKey: string;
};

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { description: 'Ясно', precipitationType: 'none', iconKey: 'clear' },
  1: {
    description: 'Преимущественно ясно',
    precipitationType: 'none',
    iconKey: 'mainly-clear',
  },
  2: {
    description: 'Переменная облачность',
    precipitationType: 'none',
    iconKey: 'partly-cloudy',
  },
  3: {
    description: 'Пасмурно',
    precipitationType: 'none',
    iconKey: 'overcast',
  },
  45: { description: 'Туман', precipitationType: 'none', iconKey: 'fog' },
  48: {
    description: 'Изморозь / туман',
    precipitationType: 'none',
    iconKey: 'fog',
  },
  51: {
    description: 'Морось слабая',
    precipitationType: 'drizzle',
    iconKey: 'drizzle',
  },
  53: {
    description: 'Морось',
    precipitationType: 'drizzle',
    iconKey: 'drizzle',
  },
  55: {
    description: 'Морось сильная',
    precipitationType: 'drizzle',
    iconKey: 'drizzle',
  },
  56: {
    description: 'Ледяная морось слабая',
    precipitationType: 'drizzle',
    iconKey: 'freezing-drizzle',
  },
  57: {
    description: 'Ледяная морось',
    precipitationType: 'drizzle',
    iconKey: 'freezing-drizzle',
  },
  61: {
    description: 'Дождь слабый',
    precipitationType: 'rain',
    iconKey: 'rain',
  },
  63: { description: 'Дождь', precipitationType: 'rain', iconKey: 'rain' },
  65: {
    description: 'Дождь сильный',
    precipitationType: 'rain',
    iconKey: 'rain',
  },
  66: {
    description: 'Ледяной дождь слабый',
    precipitationType: 'freezing_rain',
    iconKey: 'freezing-rain',
  },
  67: {
    description: 'Ледяной дождь',
    precipitationType: 'freezing_rain',
    iconKey: 'freezing-rain',
  },
  71: {
    description: 'Снег слабый',
    precipitationType: 'snow',
    iconKey: 'snow',
  },
  73: { description: 'Снег', precipitationType: 'snow', iconKey: 'snow' },
  75: {
    description: 'Снег сильный',
    precipitationType: 'snow',
    iconKey: 'snow',
  },
  77: {
    description: 'Снежная крупа',
    precipitationType: 'snow',
    iconKey: 'snow',
  },
  80: {
    description: 'Ливень слабый',
    precipitationType: 'rain',
    iconKey: 'rain-showers',
  },
  81: {
    description: 'Ливень',
    precipitationType: 'rain',
    iconKey: 'rain-showers',
  },
  82: {
    description: 'Ливень сильный',
    precipitationType: 'rain',
    iconKey: 'rain-showers',
  },
  85: {
    description: 'Снегопад слабый',
    precipitationType: 'snow',
    iconKey: 'snow-showers',
  },
  86: {
    description: 'Снегопад сильный',
    precipitationType: 'snow',
    iconKey: 'snow-showers',
  },
  95: {
    description: 'Гроза',
    precipitationType: 'thunderstorm',
    iconKey: 'thunderstorm',
  },
  96: {
    description: 'Гроза с градом',
    precipitationType: 'hail',
    iconKey: 'thunderstorm-hail',
  },
  99: {
    description: 'Гроза с сильным градом',
    precipitationType: 'hail',
    iconKey: 'thunderstorm-hail',
  },
};

const DEFAULT_WEATHER_CODE: WeatherCodeInfo = {
  description: 'Неизвестно',
  precipitationType: 'none',
  iconKey: 'unknown',
};

export function mapWeatherCode(
  code: number | null | undefined,
): WeatherCodeInfo {
  if (code == null) {
    return DEFAULT_WEATHER_CODE;
  }

  return WEATHER_CODE_MAP[code] ?? DEFAULT_WEATHER_CODE;
}

type PrecipitationInput = {
  rainMm?: number | null;
  snowfallCm?: number | null;
  weatherCode?: number | null;
};

export function resolvePrecipitationType(
  record: PrecipitationInput,
): PrecipitationType {
  const rain = record.rainMm ?? 0;
  const snow = record.snowfallCm ?? 0;

  if (rain > 0 && snow > 0) {
    return 'mixed';
  }

  if (snow > 0) {
    return 'snow';
  }

  if (rain > 0) {
    return 'rain';
  }

  return mapWeatherCode(record.weatherCode).precipitationType;
}
