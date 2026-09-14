import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import type { ReactNode } from 'react';

import { WeatherAppProvider } from '../state/WeatherAppContext.tsx';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ConfigProvider locale={ruRU}>
      <WeatherAppProvider>{children}</WeatherAppProvider>
    </ConfigProvider>
  );
}
