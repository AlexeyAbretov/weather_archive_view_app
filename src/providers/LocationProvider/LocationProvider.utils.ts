import type { SelectedLocation } from '@types';

export const SELECTED_LOCATION_STORAGE_KEY =
  'weather-archive.selected-location';

const readText = (value: unknown): string => {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

const readSelectedLocationValue = (value: unknown): SelectedLocation | null => {
  if (typeof value !== 'object' || value === null) {
    return null;
  }

  const candidate = value as SelectedLocation;
  const name = readText(candidate.name);
  const lat = candidate.lat;
  const lon = candidate.lon;

  if (
    !name ||
    typeof lat !== 'number' ||
    !Number.isFinite(lat) ||
    typeof lon !== 'number' ||
    !Number.isFinite(lon)
  ) {
    return null;
  }

  return {
    name,
    label: readText(candidate.label) || name,
    lat,
    lon,
  };
};

export const readSelectedLocation = (): SelectedLocation | null => {
  try {
    const raw = localStorage.getItem(SELECTED_LOCATION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    return readSelectedLocationValue(JSON.parse(raw));
  } catch {
    return null;
  }
};

export const saveSelectedLocation = (location: SelectedLocation): void => {
  const stored = readSelectedLocationValue(location);

  if (!stored) {
    return;
  }

  try {
    localStorage.setItem(SELECTED_LOCATION_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    return;
  }
};

export const clearSelectedLocation = (): void => {
  try {
    localStorage.removeItem(SELECTED_LOCATION_STORAGE_KEY);
  } catch {
    return;
  }
};
