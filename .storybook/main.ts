import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption } from 'vite';

const withoutPwa = (plugins: PluginOption[] | undefined): PluginOption[] =>
  (plugins ?? []).flatMap((plugin) => {
    if (Array.isArray(plugin)) {
      return [withoutPwa(plugin)];
    }

    if (
      plugin &&
      typeof plugin === 'object' &&
      'name' in plugin &&
      typeof plugin.name === 'string' &&
      plugin.name.startsWith('vite-plugin-pwa')
    ) {
      return [];
    }

    return [plugin];
  });

const config: StorybookConfig = {
  stories: ['../src/**/__stories__/**/*.stories.tsx'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (viteConfig) => {
    viteConfig.plugins = withoutPwa(viteConfig.plugins);

    return viteConfig;
  },
};

export default config;
