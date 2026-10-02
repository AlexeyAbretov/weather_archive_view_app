import { render, type RenderOptions } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import type { ReactElement, ReactNode } from 'react';

const LocaleWrapper = ({ children }: { children: ReactNode }) => {
  return <ConfigProvider locale={ruRU}>{children}</ConfigProvider>;
};

export const renderWithLocale = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, { wrapper: LocaleWrapper, ...options });
};
