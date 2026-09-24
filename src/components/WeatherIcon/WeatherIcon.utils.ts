import type { PrecipitationType, WeatherDayRecord } from '@domain';
import { mapWeatherCode } from '@domain';

import type {
  PrecipitationIntensity,
  SkyKind,
  WeatherPictureModel,
} from './WeatherIcon.types';

const CODE_INTENSITY: Record<number, PrecipitationIntensity> = {
  51: 'light',
  53: 'moderate',
  55: 'heavy',
  56: 'light',
  57: 'heavy',
  61: 'light',
  63: 'moderate',
  65: 'heavy',
  66: 'light',
  67: 'heavy',
  71: 'light',
  73: 'moderate',
  75: 'heavy',
  77: 'light',
  80: 'light',
  81: 'moderate',
  82: 'heavy',
  85: 'light',
  86: 'heavy',
  95: 'moderate',
  96: 'light',
  99: 'heavy',
};

const FREEZING_CODES = new Set([56, 57, 66, 67]);

const SPECIFIC_TYPES = new Set<PrecipitationType>([
  'drizzle',
  'thunderstorm',
  'hail',
]);

const INTENSITY_RANK: Record<PrecipitationIntensity, number> = {
  light: 0,
  moderate: 1,
  heavy: 2,
};

const intensityFromMm = (mm: number): PrecipitationIntensity => {
  if (mm < 1) {
    return 'light';
  }

  if (mm < 8) {
    return 'moderate';
  }

  return 'heavy';
};

const strongerIntensity = (
  left: PrecipitationIntensity,
  right: PrecipitationIntensity,
): PrecipitationIntensity => {
  if (INTENSITY_RANK[left] >= INTENSITY_RANK[right]) {
    return left;
  }

  return right;
};

const resolveSky = (record: WeatherDayRecord): SkyKind => {
  const iconKey = record.iconKey ?? mapWeatherCode(record.weatherCode).iconKey;

  if (iconKey === 'fog') {
    return 'fog';
  }

  if (record.cloudCover == null) {
    if (iconKey === 'clear' || iconKey === 'mainly-clear') {
      return 'clear';
    }

    if (iconKey === 'partly-cloudy') {
      return 'partly';
    }

    if (iconKey === 'unknown') {
      return 'unknown';
    }

    return 'overcast';
  }

  if (record.cloudCover <= 20) {
    return 'clear';
  }

  if (record.cloudCover <= 60) {
    return 'partly';
  }

  return 'overcast';
};

const resolvePrecipitation = (record: WeatherDayRecord): PrecipitationType => {
  const codeInfo = mapWeatherCode(record.weatherCode);
  const iconKey = record.iconKey ?? codeInfo.iconKey;

  if (record.precipitationType === 'mixed') {
    return 'mixed';
  }

  if (
    (record.weatherCode != null && FREEZING_CODES.has(record.weatherCode)) ||
    iconKey === 'freezing-rain' ||
    iconKey === 'freezing-drizzle'
  ) {
    return 'freezing_rain';
  }

  if (SPECIFIC_TYPES.has(codeInfo.precipitationType)) {
    return codeInfo.precipitationType;
  }

  return record.precipitationType ?? codeInfo.precipitationType;
};

const resolveIntensity = (
  record: WeatherDayRecord,
  precipitation: PrecipitationType,
): PrecipitationIntensity => {
  if (precipitation === 'none') {
    return 'light';
  }

  const fromCode =
    record.weatherCode == null ? undefined : CODE_INTENSITY[record.weatherCode];
  const mm = record.precipitationMm;
  const fromMm = mm != null && mm > 0 ? intensityFromMm(mm) : undefined;

  if (fromCode && fromMm) {
    return strongerIntensity(fromCode, fromMm);
  }

  return fromCode ?? fromMm ?? 'light';
};

export const resolveWeatherPicture = (
  record: WeatherDayRecord,
): WeatherPictureModel => {
  const precipitation = resolvePrecipitation(record);

  return {
    sky: resolveSky(record),
    precipitation,
    intensity: resolveIntensity(record, precipitation),
  };
};
