import type { Meta, StoryObj } from '@storybook/react-vite';

import type { WeatherDayRecord } from '@domain';

import { DayWeatherCell } from '../DayWeatherCell';

const withData: WeatherDayRecord = {
  date: '2020-09-15',
  year: 2020,
  hasData: true,
  tempMin: -1.2,
  tempMax: 16.6,
  precipitationMm: 1.2,
  precipitationType: 'rain',
  windSpeedMax: 16.4,
  windDirection: 180,
  cloudCover: 40,
  weatherCode: 61,
  iconKey: 'rain',
};

const meta = {
  title: 'Components/DayWeatherCell',
  component: DayWeatherCell,
  args: {
    record: withData,
  },
} satisfies Meta<typeof DayWeatherCell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithData: Story = {};

export const NoData: Story = {
  args: {
    record: {
      date: '2020-09-15',
      year: 2020,
      hasData: false,
      noDataReason: 'missing',
    },
  },
};
