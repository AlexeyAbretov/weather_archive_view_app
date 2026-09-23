/**
 * Open-Meteo Archive API — non-commercial use по умолчанию.
 * @see https://open-meteo.com/en/docs/historical-weather-api
 */
import type {
  OpenMeteoArchiveError,
  OpenMeteoArchiveResponse,
} from './archiveResponse.types.ts';

const ARCHIVE_API_URL = 'https://archive-api.open-meteo.com/v1/archive';

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

export type ArchiveRequestParams = {
  lat: number;
  lon: number;
  startDate: string;
  endDate: string;
  signal?: AbortSignal;
};

export class ArchiveApiError extends Error {
  readonly status?: number;
  readonly reason?: string;

  constructor(message: string, status?: number, reason?: string) {
    super(message);
    this.name = 'ArchiveApiError';
    this.status = status;
    this.reason = reason;
  }
}

export const fetchArchive = async (
  params: ArchiveRequestParams,
): Promise<OpenMeteoArchiveResponse> => {
  const url = new URL(ARCHIVE_API_URL);

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
    OpenMeteoArchiveResponse | OpenMeteoArchiveError;

  if (!response.ok) {
    throw new ArchiveApiError(
      'Open-Meteo Archive API вернул ошибку',
      response.status,
      'reason' in payload ? payload.reason : undefined,
    );
  }

  if ('error' in payload && payload.error) {
    throw new ArchiveApiError(
      payload.reason ?? 'Open-Meteo Archive API вернул ошибку',
      response.status,
      payload.reason,
    );
  }

  return payload as OpenMeteoArchiveResponse;
};
