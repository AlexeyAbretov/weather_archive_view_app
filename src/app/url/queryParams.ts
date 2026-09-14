import dayjs from 'dayjs';

export type ViewMode = 'a' | 'b';

export type AppQueryParams = {
  lat: number | null;
  lon: number | null;
  city: string | null;
  date: string;
  mode: ViewMode;
};

const DEFAULT_MODE: ViewMode = 'a';

export function getDefaultDate(): string {
  return dayjs().format('YYYY-MM-DD');
}

export function parseQueryParams(search: string): AppQueryParams {
  const params = new URLSearchParams(search);

  const latRaw = params.get('lat');
  const lonRaw = params.get('lon');
  const lat = latRaw !== null ? Number(latRaw) : null;
  const lon = lonRaw !== null ? Number(lonRaw) : null;

  const dateRaw = params.get('date');
  const date =
    dateRaw && dayjs(dateRaw, 'YYYY-MM-DD', true).isValid() ? dateRaw : getDefaultDate();

  const modeRaw = params.get('mode');
  const mode: ViewMode = modeRaw === 'b' ? 'b' : DEFAULT_MODE;

  const city = params.get('city');

  return {
    lat: Number.isFinite(lat) ? lat : null,
    lon: Number.isFinite(lon) ? lon : null,
    city,
    date,
    mode,
  };
}

export function buildQueryString(params: Partial<AppQueryParams>, current: AppQueryParams): string {
  const next: AppQueryParams = { ...current, ...params };
  const search = new URLSearchParams();

  if (next.lat !== null && next.lon !== null) {
    search.set('lat', String(next.lat));
    search.set('lon', String(next.lon));
  }
  if (next.city) {
    search.set('city', next.city);
  }
  search.set('date', next.date);
  if (next.mode !== DEFAULT_MODE) {
    search.set('mode', next.mode);
  }

  return search.toString();
}
