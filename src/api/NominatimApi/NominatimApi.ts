const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const ADMINISTRATIVE_PREFIXES = [
  'городской округ',
  'муниципальный округ',
  'муниципальный район',
  'городское поселение',
  'сельское поселение',
  'город',
  'район',
  'округ',
];

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  hamlet?: string;
  suburb?: string;
  county?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
};

const readPlace = (value: string | undefined): string | null => {
  const trimmed = value?.trim() ?? '';

  return trimmed || null;
};

const readAdministrativePlace = (value: string | undefined): string | null => {
  const trimmed = readPlace(value);

  if (!trimmed) {
    return null;
  }

  const lower = trimmed.toLowerCase();
  const prefix = ADMINISTRATIVE_PREFIXES.find((item) => {
    return lower.startsWith(`${item} `);
  });

  if (!prefix) {
    return trimmed;
  }

  return readPlace(trimmed.slice(prefix.length));
};

const pushPlace = (names: string[], value: string | null): void => {
  if (!value) {
    return;
  }

  const exists = names.some((name) => {
    return name.toLowerCase() === value.toLowerCase();
  });

  if (!exists) {
    names.push(value);
  }
};

const extractPlaceNames = (address: NominatimAddress): string[] => {
  const names: string[] = [];

  pushPlace(names, readPlace(address.city));
  pushPlace(names, readPlace(address.town));
  pushPlace(names, readPlace(address.village));
  pushPlace(names, readPlace(address.municipality));
  pushPlace(names, readPlace(address.hamlet));
  pushPlace(names, readPlace(address.suburb));
  pushPlace(names, readAdministrativePlace(address.county));

  return names;
};

export const reverseGeocode = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<string[]> => {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
    'accept-language': 'ru',
    zoom: '14',
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error(`Nominatim API: HTTP ${response.status}`);
  }

  const data = (await response.json()) as NominatimResponse;

  if (!data.address) {
    return [];
  }

  return extractPlaceNames(data.address);
};
