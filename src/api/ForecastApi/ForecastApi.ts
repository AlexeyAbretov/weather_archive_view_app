/**
 * Open-Meteo Forecast API — non-commercial use по умолчанию.
 * @see https://open-meteo.com/en/docs
 */
import type {
  ForecastRequestParams,
  OpenMeteoForecastError,
  OpenMeteoForecastResponse,
} from './ForecastApi.types';

const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

const DAILY_FIELDS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'rain_sum',
  'snowfall_sum',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
] as const;

const HOURLY_FIELDS = ['weather_code', 'cloud_cover'] as const;

export class ForecastApiError extends Error {
  readonly status?: number;
  readonly reason?: string;

  constructor(message: string, status?: number, reason?: string) {
    super(message);
    this.name = 'ForecastApiError';
    this.status = status;
    this.reason = reason;
  }
}

export const fetchForecast = async (
  params: ForecastRequestParams,
): Promise<OpenMeteoForecastResponse> => {
  const url = new URL(FORECAST_API_URL);

  url.searchParams.set('latitude', String(params.lat));
  url.searchParams.set('longitude', String(params.lon));
  url.searchParams.set('start_date', params.startDate);
  url.searchParams.set('end_date', params.endDate);
  url.searchParams.set('daily', DAILY_FIELDS.join(','));
  url.searchParams.set('hourly', HOURLY_FIELDS.join(','));
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('wind_speed_unit', 'kmh');
  url.searchParams.set('precipitation_unit', 'mm');

  const response = await fetch(url, { signal: params.signal });

  const payload = (await response.json()) as
    OpenMeteoForecastResponse | OpenMeteoForecastError;

  if (!response.ok) {
    throw new ForecastApiError(
      'Open-Meteo Forecast API вернул ошибку',
      response.status,
      'reason' in payload ? payload.reason : undefined,
    );
  }

  if ('error' in payload && payload.error) {
    throw new ForecastApiError(
      payload.reason ?? 'Open-Meteo Forecast API вернул ошибку',
      response.status,
      payload.reason,
    );
  }

  return payload as OpenMeteoForecastResponse;
};
