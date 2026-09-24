export const formatTemperature = (value: number | undefined): string => {
  if (value == null) {
    return '—';
  }

  const rounded = Math.round(value);
  const sign = rounded > 0 ? '+' : '';

  return `${sign}${rounded}°`;
};

export const formatPrecipitationMm = (value: number | undefined): string => {
  if (value == null) {
    return '—';
  }

  if (value === 0) {
    return '0 мм';
  }

  return `${value.toFixed(1)} мм`;
};

export const formatWindSpeed = (value: number | undefined): string => {
  if (value == null) {
    return '—';
  }

  return `${Math.round(value)} км/ч`;
};

const WIND_DIRECTION_LABELS = [
  'С',
  'СВ',
  'В',
  'ЮВ',
  'Ю',
  'ЮЗ',
  'З',
  'СЗ',
] as const;

export const formatWindDirection = (
  degrees: number | undefined,
): string | undefined => {
  if (degrees == null || Number.isNaN(degrees)) {
    return undefined;
  }

  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 45) % WIND_DIRECTION_LABELS.length;

  return WIND_DIRECTION_LABELS[index];
};
