import '@ant-design/v5-patch-for-react-19';
import '../src/index.css';

import type { Preview } from '@storybook/react-vite';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import type { ReactNode } from 'react';

const withLocale = (Story: () => ReactNode) => {
  return (
    <ConfigProvider locale={ruRU}>
      <Story />
    </ConfigProvider>
  );
};

const preview: Preview = {
  decorators: [withLocale],
};

export default preview;
