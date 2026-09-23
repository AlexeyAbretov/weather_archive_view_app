import type { CitySearchResult } from './location.types';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const MIN_QUERY_LENGTH = 2;
const MAX_CACHE_SIZE = 20;

type GeocodingApiResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country?: string;
};

type GeocodingApiResponse = {
  results?: GeocodingApiResult[];
  error?: boolean;
  reason?: string;
};

const searchCache = new Map<string, CitySearchResult[]>();

const formatCityLabel = (result: GeocodingApiResult): string => {
  const parts = [result.name];

  if (result.admin1) {
    parts.push(result.admin1);
  }

  if (result.country) {
    parts.push(result.country);
  }

  return parts.join(', ');
};

const mapResult = (result: GeocodingApiResult): CitySearchResult => {
  return {
    name: result.name,
    lat: result.latitude,
    lon: result.longitude,
    label: formatCityLabel(result),
  };
};

const trimCache = (): void => {
  if (searchCache.size <= MAX_CACHE_SIZE) {
    return;
  }

  const oldestKey = searchCache.keys().next().value;

  if (oldestKey) {
    searchCache.delete(oldestKey);
  }
};

export const isSearchQueryValid = (query: string): boolean => {
  return query.trim().length >= MIN_QUERY_LENGTH;
};

export const searchCities = async (
  query: string,
  signal?: AbortSignal,
): Promise<CitySearchResult[]> => {
  const normalizedQuery = query.trim();

  if (!isSearchQueryValid(normalizedQuery)) {
    return [];
  }

  const cacheKey = normalizedQuery.toLowerCase();
  const cached = searchCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  const params = new URLSearchParams({
    name: normalizedQuery,
    language: 'ru',
    count: '10',
    format: 'json',
  });

  const response = await fetch(`${GEOCODING_URL}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Geocoding API: HTTP ${response.status}`);
  }

  const data = (await response.json()) as GeocodingApiResponse;

  if (data.error) {
    throw new Error(data.reason ?? 'Geocoding API вернул ошибку');
  }

  const results = (data.results ?? []).map(mapResult);

  searchCache.set(cacheKey, results);
  trimCache();

  return results;
};
