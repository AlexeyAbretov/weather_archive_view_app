import type { Meta, StoryObj } from '@storybook/react-vite';

import type { YearWeatherRow } from '@domain';

import { YearWeatherTable } from '../YearWeatherTable';

const row: YearWeatherRow = {
  year: 2020,
  day: {
    date: '2020-09-15',
    year: 2020,
    hasData: true,
    tempMin: 4,
    tempMax: 16,
    precipitationMm: 0.4,
    precipitationType: 'drizzle',
    windSpeedMax: 12,
    windDirection: 45,
    cloudCover: 55,
    weatherCode: 51,
    iconKey: 'drizzle',
  },
};

const meta = {
  title: 'Components/YearWeatherTable',
  component: YearWeatherTable,
  args: {
    data: [row],
  },
} satisfies Meta<typeof YearWeatherTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithRows: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
    data: [],
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
};
