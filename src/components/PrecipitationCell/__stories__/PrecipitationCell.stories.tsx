import type { Meta, StoryObj } from '@storybook/react-vite';

import type { WeatherDayRecord } from '@domain';

import { PrecipitationCell } from '../PrecipitationCell';

const record: WeatherDayRecord = {
  date: '2020-09-15',
  year: 2020,
  hasData: true,
  precipitationMm: 1.2,
  precipitationType: 'rain',
};

const meta = {
  title: 'Components/PrecipitationCell',
  component: PrecipitationCell,
  args: {
    record,
  },
} satisfies Meta<typeof PrecipitationCell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Rain: Story = {};

export const None: Story = {
  args: {
    record: {
      ...record,
      precipitationMm: 0,
      precipitationType: 'none',
    },
  },
};

export const NoData: Story = {
  args: {
    record: {
      date: '2020-09-15',
      year: 2020,
      hasData: false,
      noDataReason: 'future',
    },
  },
};
