import { createContext, useCallback, useMemo, useState } from 'react';

import type { SelectedLocation } from '@types';

import type {
  LocationContextValue,
  LocationProviderProps,
} from './LocationProvider.types';
import {
  clearSelectedLocation,
  readSelectedLocation,
  saveSelectedLocation,
} from './LocationProvider.utils';

export const LocationContext = createContext<LocationContextValue | null>(null);

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocationState] = useState<SelectedLocation | null>(
    readSelectedLocation,
  );

  const setLocation = useCallback((nextLocation: SelectedLocation) => {
    saveSelectedLocation(nextLocation);
    setLocationState(nextLocation);
  }, []);

  const clearLocation = useCallback(() => {
    clearSelectedLocation();
    setLocationState(null);
  }, []);

  const value = useMemo(
    () => ({
      location,
      setLocation,
      clearLocation,
    }),
    [location, setLocation, clearLocation],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
