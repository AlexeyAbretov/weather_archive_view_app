import type { ReactNode } from 'react';

import type { SelectedLocation } from '@types';

export type LocationContextValue = {
  location: SelectedLocation | null;
  setLocation: (location: SelectedLocation) => void;
  clearLocation: () => void;
};

export type LocationProviderProps = {
  children: ReactNode;
};
