import type { PrecipitationType, WeatherDayRecord } from '@domain';

export type WeatherIconProps = {
  record: WeatherDayRecord;
};

export type SkyKind = 'clear' | 'partly' | 'overcast' | 'fog' | 'unknown';

export type PrecipitationIntensity = 'light' | 'moderate' | 'heavy';

export type WeatherPictureModel = {
  sky: SkyKind;
  precipitation: PrecipitationType;
  intensity: PrecipitationIntensity;
};
