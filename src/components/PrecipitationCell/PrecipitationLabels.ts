import type { PrecipitationType } from '@domain';

const PRECIPITATION_LABELS: Record<PrecipitationType, string> = {
  none: 'без осадков',
  rain: 'дождь',
  snow: 'снег',
  mixed: 'смешанные',
  drizzle: 'морось',
  freezing_rain: 'ледяной дождь',
  thunderstorm: 'гроза',
  hail: 'град',
};

export const getPrecipitationLabel = (
  type: PrecipitationType | undefined,
): string => {
  if (!type) {
    return '—';
  }

  return PRECIPITATION_LABELS[type];
};
