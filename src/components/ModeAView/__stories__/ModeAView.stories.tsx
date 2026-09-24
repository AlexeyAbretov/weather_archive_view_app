import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { YearWeatherRow } from '@domain';

import { ModeAView } from '../ModeAView';

const location = { name: 'Москва', lat: 55.752, lon: 37.6178 };

const row: YearWeatherRow = {
  year: 2020,
  day: {
    date: '2020-09-15',
    year: 2020,
    hasData: true,
    tempMin: 4,
    tempMax: 16,
    precipitationMm: 0,
    precipitationType: 'none',
    windSpeedMax: 10,
    windDirection: 90,
    cloudCover: 20,
    weatherCode: 0,
    iconKey: 'clear',
  },
};

const meta = {
  title: 'Components/ModeAView',
  component: ModeAView,
  args: {
    data: [],
    error: null,
    loading: false,
    location,
    onReload: fn(),
  },
} satisfies Meta<typeof ModeAView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyLocation: Story = {
  args: {
    location: null,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const ErrorState: Story = {
  args: {
    error: new Error('Сеть недоступна'),
  },
};

export const WithData: Story = {
  args: {
    data: [row],
  },
};
