import type { ReactNode } from 'react';

import type { AnchorDate } from '@types';

export type WeatherAppState = {
  anchorDate: AnchorDate;
  yearRange: number[];
  yearRangeLabel: string;
  setAnchorDate: (date: AnchorDate) => void;
};

export type WeatherAppProviderProps = {
  children: ReactNode;
};
