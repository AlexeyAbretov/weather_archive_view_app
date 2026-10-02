export type OpenMeteoDailyVariables = {
  time: string[];
  temperature_2m_max: (number | null)[];
  temperature_2m_min: (number | null)[];
  precipitation_sum: (number | null)[];
  rain_sum: (number | null)[];
  snowfall_sum: (number | null)[];
  wind_speed_10m_max: (number | null)[];
  wind_direction_10m_dominant: (number | null)[];
};

export type OpenMeteoHourlyVariables = {
  time: string[];
  weather_code: (number | null)[];
  cloud_cover: (number | null)[];
};

export type OpenMeteoArchiveResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: OpenMeteoDailyVariables;
  hourly: OpenMeteoHourlyVariables;
};

export type OpenMeteoArchiveError = {
  reason?: string;
  error?: boolean;
};

export type ArchiveRequestParams = {
  lat: number;
  lon: number;
  startDate: string;
  endDate: string;
  signal?: AbortSignal;
};
