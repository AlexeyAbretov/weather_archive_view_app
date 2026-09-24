import { createContext, useCallback, useMemo, useState } from 'react';

import type { SelectedLocation } from '@types';

import type {
  LocationContextValue,
  LocationProviderProps,
} from './LocationProvider.types';

export const LocationContext = createContext<LocationContextValue | null>(null);

export const LocationProvider = ({ children }: LocationProviderProps) => {
  const [location, setLocationState] = useState<SelectedLocation | null>(null);

  const setLocation = useCallback((nextLocation: SelectedLocation) => {
    setLocationState(nextLocation);
  }, []);

  const clearLocation = useCallback(() => {
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
