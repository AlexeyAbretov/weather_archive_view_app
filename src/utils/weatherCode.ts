type WeatherCodeInfo = {
  labelRu: string;
  precipitationTypeRu: string;
  iconKey: string;
};

const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { labelRu: 'Ясно', precipitationTypeRu: 'Без осадков', iconKey: 'clear' },
  1: { labelRu: 'Преимущественно ясно', precipitationTypeRu: 'Без осадков', iconKey: 'mostly-clear' },
  2: { labelRu: 'Переменная облачность', precipitationTypeRu: 'Без осадков', iconKey: 'partly-cloudy' },
  3: { labelRu: 'Пасмурно', precipitationTypeRu: 'Без осадков', iconKey: 'cloudy' },
  45: { labelRu: 'Туман', precipitationTypeRu: 'Без осадков', iconKey: 'fog' },
  48: { labelRu: 'Изморозь', precipitationTypeRu: 'Без осадков', iconKey: 'fog' },
  51: { labelRu: 'Морось', precipitationTypeRu: 'Дождь', iconKey: 'drizzle' },
  53: { labelRu: 'Морось', precipitationTypeRu: 'Дождь', iconKey: 'drizzle' },
  55: { labelRu: 'Морось', precipitationTypeRu: 'Дождь', iconKey: 'drizzle' },
  56: { labelRu: 'Ледяная морось', precipitationTypeRu: 'Дождь', iconKey: 'drizzle' },
  57: { labelRu: 'Ледяная морось', precipitationTypeRu: 'Дождь', iconKey: 'drizzle' },
  61: { labelRu: 'Дождь', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  63: { labelRu: 'Дождь', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  65: { labelRu: 'Ливень', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  66: { labelRu: 'Ледяной дождь', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  67: { labelRu: 'Ледяной дождь', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  71: { labelRu: 'Снег', precipitationTypeRu: 'Снег', iconKey: 'snow' },
  73: { labelRu: 'Снег', precipitationTypeRu: 'Снег', iconKey: 'snow' },
  75: { labelRu: 'Снегопад', precipitationTypeRu: 'Снег', iconKey: 'snow' },
  77: { labelRu: 'Снег', precipitationTypeRu: 'Снег', iconKey: 'snow' },
  80: { labelRu: 'Ливень', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  81: { labelRu: 'Ливень', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  82: { labelRu: 'Ливень', precipitationTypeRu: 'Дождь', iconKey: 'rain' },
  85: { labelRu: 'Снегопад', precipitationTypeRu: 'Снег', iconKey: 'snow' },
  86: { labelRu: 'Снегопад', precipitationTypeRu: 'Снег', iconKey: 'snow' },
  95: { labelRu: 'Гроза', precipitationTypeRu: 'Дождь', iconKey: 'thunderstorm' },
  96: { labelRu: 'Гроза с градом', precipitationTypeRu: 'Дождь', iconKey: 'thunderstorm' },
  99: { labelRu: 'Гроза с градом', precipitationTypeRu: 'Дождь', iconKey: 'thunderstorm' },
};

const DEFAULT_INFO: WeatherCodeInfo = {
  labelRu: 'Неизвестно',
  precipitationTypeRu: 'Без осадков',
  iconKey: 'unknown',
};

function getInfo(code: number | null): WeatherCodeInfo {
  if (code === null) {
    return DEFAULT_INFO;
  }
  return WEATHER_CODES[code] ?? DEFAULT_INFO;
}

export function getWeatherLabel(code: number | null): string {
  return getInfo(code).labelRu;
}

export function getWeatherIconKey(code: number | null): string {
  return getInfo(code).iconKey;
}

export function getPrecipitationLabel(
  code: number | null,
  rainSum: number | null,
  snowSum: number | null,
): string {
  if ((snowSum ?? 0) > 0) {
    return 'Снег';
  }
  if ((rainSum ?? 0) > 0) {
    return 'Дождь';
  }
  return getInfo(code).precipitationTypeRu;
}

const WIND_DIRECTIONS = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'] as const;

export function formatWindDirection(degrees: number | null): string {
  if (degrees === null) {
    return '';
  }
  const index = Math.round(degrees / 45) % 8;
  return WIND_DIRECTIONS[index] ?? '';
}

export function formatTemperature(value: number | null): string {
  if (value === null) {
    return '—';
  }
  const rounded = Math.round(value);
  return rounded > 0 ? `+${rounded}°` : `${rounded}°`;
}
