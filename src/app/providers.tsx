import { LocationProvider } from '@features/location/LocationProvider.tsx';
import { WeatherAppProvider } from '@state/WeatherAppContext.tsx';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import type { ReactNode } from 'react';

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <ConfigProvider locale={ruRU}>
      <WeatherAppProvider>
        <LocationProvider>{children}</LocationProvider>
      </WeatherAppProvider>
    </ConfigProvider>
  );
};
