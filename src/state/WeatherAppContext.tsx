import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { formatYearRange, getYearRange, todayAnchorDate } from '@lib';
import type { AnchorDate } from '@types';

export type WeatherAppState = {
  anchorDate: AnchorDate;
  yearRange: number[];
  yearRangeLabel: string;
  setAnchorDate: (date: AnchorDate) => void;
};

export const WeatherAppContext = createContext<WeatherAppState | null>(null);

type WeatherAppProviderProps = {
  children: ReactNode;
};

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
