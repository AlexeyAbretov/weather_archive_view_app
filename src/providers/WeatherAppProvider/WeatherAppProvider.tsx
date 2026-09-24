import { createContext, useCallback, useMemo, useState } from 'react';

import type { AnchorDate } from '@types';
import { formatYearRange, getYearRange, todayAnchorDate } from '@utils';

import type {
  WeatherAppProviderProps,
  WeatherAppState,
} from './WeatherAppProvider.types';

export const WeatherAppContext = createContext<WeatherAppState | null>(null);

export const WeatherAppProvider = ({ children }: WeatherAppProviderProps) => {
  const [anchorDate, setAnchorDateState] =
    useState<AnchorDate>(todayAnchorDate);

  const setAnchorDate = useCallback((date: AnchorDate) => {
    setAnchorDateState(date);
  }, []);

  const yearRange = useMemo(() => getYearRange(anchorDate), [anchorDate]);
  const yearRangeLabel = useMemo(
    () => formatYearRange(anchorDate),
    [anchorDate],
  );

  const value = useMemo(
    (): WeatherAppState => ({
      anchorDate,
      setAnchorDate,
      yearRange,
      yearRangeLabel,
    }),
    [anchorDate, setAnchorDate, yearRange, yearRangeLabel],
  );

  return (
    <WeatherAppContext.Provider value={value}>
      {children}
    </WeatherAppContext.Provider>
  );
};
