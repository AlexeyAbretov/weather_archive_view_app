const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
const USER_AGENT = 'weather_archive_view_app/1.0';

type NominatimAddress = {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
};

type NominatimResponse = {
  address?: NominatimAddress;
};

const extractCityName = (address: NominatimAddress): string | null => {
  return (
    address.city ??
    address.town ??
    address.village ??
    address.municipality ??
    null
  );
};

export const reverseGeocode = async (
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<string | null> => {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    format: 'json',
    'accept-language': 'ru',
    zoom: '10',
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
    signal,
    headers: {
      'User-Agent': USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Nominatim API: HTTP ${response.status}`);
  }

  const data = (await response.json()) as NominatimResponse;

  if (!data.address) {
    return null;
  }

  return extractCityName(data.address);
};
