import type { DailyWeather } from '../domain/dailyWeather';
import { fetchJson } from './httpClient';
import { archiveRequestQueue } from './requestQueue';

const DAILY_PARAMS = [
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_sum',
  'rain_sum',
  'snowfall_sum',
  'weather_code',
  'wind_speed_10m_max',
  'wind_direction_10m_dominant',
].join(',');

type ArchiveResponse = {
  daily?: {
    time: string[];
    temperature_2m_max?: Array<number | null>;
    temperature_2m_min?: Array<number | null>;
    precipitation_sum?: Array<number | null>;
    rain_sum?: Array<number | null>;
    snowfall_sum?: Array<number | null>;
    weather_code?: Array<number | null>;
    wind_speed_10m_max?: Array<number | null>;
    wind_direction_10m_dominant?: Array<number | null>;
  };
};

function mapDailyWeather(index: number, daily: NonNullable<ArchiveResponse['daily']>): DailyWeather {
  return {
    date: daily.time[index] ?? '',
    temperatureMax: daily.temperature_2m_max?.[index] ?? null,
    temperatureMin: daily.temperature_2m_min?.[index] ?? null,
    precipitationSum: daily.precipitation_sum?.[index] ?? null,
    rainSum: daily.rain_sum?.[index] ?? null,
    snowfallSum: daily.snowfall_sum?.[index] ?? null,
    weatherCode: daily.weather_code?.[index] ?? null,
    windSpeedMax: daily.wind_speed_10m_max?.[index] ?? null,
    windDirection: daily.wind_direction_10m_dominant?.[index] ?? null,
  };
}

export async function fetchDailyRange(
  latitude: number,
  longitude: number,
  startDate: string,
  endDate: string,
  timezone: string,
): Promise<DailyWeather[]> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    start_date: startDate,
    end_date: endDate,
    timezone,
    daily: DAILY_PARAMS,
  });

  const url = `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`;

  const data = await archiveRequestQueue.enqueue(() => fetchJson<ArchiveResponse>(url));

  const daily = data.daily;
  if (!daily?.time?.length) {
    return [];
  }

  return daily.time.map((_, index) => mapDailyWeather(index, daily));
}

export async function fetchDailyForDate(
  latitude: number,
  longitude: number,
  date: string,
  timezone: string,
): Promise<DailyWeather | null> {
  const results = await fetchDailyRange(latitude, longitude, date, date, timezone);
  return results[0] ?? null;
}
