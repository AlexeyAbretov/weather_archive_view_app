import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  buildQueryString,
  getDefaultDate,
  parseQueryParams,
  type AppQueryParams,
  type ViewMode,
} from '../url/queryParams';

type LocationSelection = {
  lat: number;
  lon: number;
  city: string;
  timezone: string;
};

type AppFiltersContextValue = {
  location: LocationSelection | null;
  date: string;
  mode: ViewMode;
  setLocation: (location: LocationSelection) => void;
  setDate: (date: string) => void;
  setMode: (mode: ViewMode) => void;
  hasLocation: boolean;
};

const AppFiltersContext = createContext<AppFiltersContextValue | null>(null);

function readInitialParams(): AppQueryParams {
  if (typeof window === 'undefined') {
    return { lat: null, lon: null, city: null, date: getDefaultDate(), mode: 'a' };
  }
  return parseQueryParams(window.location.search);
}

function syncUrl(params: AppQueryParams): void {
  const query = buildQueryString({}, params);
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export function AppFiltersProvider({ children }: { children: ReactNode }) {
  const initial = readInitialParams();

  const [location, setLocationState] = useState<LocationSelection | null>(() => {
    if (initial.lat !== null && initial.lon !== null) {
      return {
        lat: initial.lat,
        lon: initial.lon,
        city: initial.city ?? 'Выбранное место',
        timezone: 'auto',
      };
    }
    return null;
  });
  const [date, setDateState] = useState(initial.date);
  const [mode, setModeState] = useState<ViewMode>(initial.mode);

  const updateUrl = useCallback(
    (patch: Partial<AppQueryParams>) => {
      const current: AppQueryParams = {
        lat: location?.lat ?? null,
        lon: location?.lon ?? null,
        city: location?.city ?? null,
        date,
        mode,
      };
      const next = { ...current, ...patch };
      syncUrl(next);
    },
    [location, date, mode],
  );

  const setLocation = useCallback(
    (nextLocation: LocationSelection) => {
      setLocationState(nextLocation);
      updateUrl({
        lat: nextLocation.lat,
        lon: nextLocation.lon,
        city: nextLocation.city,
      });
    },
    [updateUrl],
  );

  const setDate = useCallback(
    (nextDate: string) => {
      setDateState(nextDate);
      updateUrl({ date: nextDate });
    },
    [updateUrl],
  );

  const setMode = useCallback(
    (nextMode: ViewMode) => {
      setModeState(nextMode);
      updateUrl({ mode: nextMode });
    },
    [updateUrl],
  );

  const value = useMemo<AppFiltersContextValue>(
    () => ({
      location,
      date,
      mode,
      setLocation,
      setDate,
      setMode,
      hasLocation: location !== null,
    }),
    [location, date, mode, setLocation, setDate, setMode],
  );

  return <AppFiltersContext.Provider value={value}>{children}</AppFiltersContext.Provider>;
}

export function useAppFilters(): AppFiltersContextValue {
  const context = useContext(AppFiltersContext);
  if (!context) {
    throw new Error('useAppFilters must be used within AppFiltersProvider');
  }
  return context;
}
