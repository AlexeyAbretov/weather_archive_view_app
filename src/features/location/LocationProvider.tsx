import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import type { SelectedLocation } from './types.ts';

type LocationContextValue = {
  location: SelectedLocation | null;
  setLocation: (location: SelectedLocation) => void;
  clearLocation: () => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

type LocationProviderProps = {
  children: ReactNode;
};

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

export const useSelectedLocation = (): LocationContextValue => {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      'useSelectedLocation должен использоваться в LocationProvider',
    );
  }

  return context;
};
