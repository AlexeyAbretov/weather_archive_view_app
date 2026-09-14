import { useContext } from 'react';

import {
  WeatherAppContext,
  type WeatherAppState,
} from './WeatherAppContext.tsx';

export function useWeatherAppState(): WeatherAppState {
  const context = useContext(WeatherAppContext);

  if (!context) {
    throw new Error(
      'useWeatherAppState должен вызываться внутри WeatherAppProvider',
    );
  }

  return context;
}
