import dayjs, { type Dayjs } from 'dayjs';
import {
  createContext,
  type ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import {
  formatYearRange,
  getYearRange,
  parseAnchorDate,
} from '../lib/date/anchorDate.ts';
import type { AnchorDate } from '../types/anchorDate.ts';

export type WeatherAppState = {
  anchorDate: AnchorDate;
  yearRange: number[];
  yearRangeLabel: string;
  setAnchorDate: (date: Dayjs | null) => void;
};

export const WeatherAppContext = createContext<WeatherAppState | null>(null);

type WeatherAppProviderProps = {
  children: ReactNode;
};

export function WeatherAppProvider({ children }: WeatherAppProviderProps) {
  const [anchorDate, setAnchorDateState] = useState<AnchorDate>(() =>
    parseAnchorDate(dayjs()),
  );

  const setAnchorDate = useCallback((date: Dayjs | null) => {
    if (!date?.isValid()) {
      return;
    }

    setAnchorDateState(parseAnchorDate(date));
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
}
