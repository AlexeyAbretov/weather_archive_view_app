import 'dayjs/locale/ru';

import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import dayjs from 'dayjs';
import type { ReactNode } from 'react';

import { LocationProvider } from '../features/location/LocationProvider.tsx';
import { WeatherAppProvider } from '../state/WeatherAppContext.tsx';

dayjs.locale('ru');

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigProvider locale={ruRU}>
      <WeatherAppProvider>
        <LocationProvider>{children}</LocationProvider>
      </WeatherAppProvider>
    </ConfigProvider>
  );
}
