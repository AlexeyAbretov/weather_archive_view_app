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
