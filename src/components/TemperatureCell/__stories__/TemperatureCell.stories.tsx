import type { Meta, StoryObj } from '@storybook/react-vite';

import type { WeatherDayRecord } from '@domain';

import { TemperatureCell } from '../TemperatureCell';

const record: WeatherDayRecord = {
  date: '2020-09-15',
  year: 2020,
  hasData: true,
  tempMin: -1.2,
  tempMax: 16.6,
};

const meta = {
  title: 'Components/TemperatureCell',
  component: TemperatureCell,
  args: {
    record,
  },
} satisfies Meta<typeof TemperatureCell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithData: Story = {};

export const NoData: Story = {
  args: {
    record: {
      date: '2020-09-15',
      year: 2020,
      hasData: false,
      noDataReason: 'archive_lag',
    },
  },
};
