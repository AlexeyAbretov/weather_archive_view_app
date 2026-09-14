import type { Location } from '../domain/location';
import { fetchJson } from './httpClient';

type GeocodingResponse = {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
    country: string;
    admin1?: string;
  }>;
};

function mapLocation(raw: NonNullable<GeocodingResponse['results']>[number]): Location {
  const admin1 = raw.admin1 ?? '';
  const displayName = admin1 ? `${raw.name}, ${admin1}, ${raw.country}` : `${raw.name}, ${raw.country}`;

  return {
    id: raw.id,
    name: raw.name,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone,
    country: raw.country,
    admin1,
    displayName,
  };
}

export async function searchLocations(query: string): Promise<Location[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const params = new URLSearchParams({
    name: trimmed,
    language: 'ru',
    count: '10',
  });

  const data = await fetchJson<GeocodingResponse>(
    `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`,
  );

  return (data.results ?? []).map(mapLocation);
}
