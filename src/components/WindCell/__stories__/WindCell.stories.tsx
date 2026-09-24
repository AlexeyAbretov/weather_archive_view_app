import type { Meta, StoryObj } from '@storybook/react-vite';

import type { WeatherDayRecord } from '@domain';

import { WindCell } from '../WindCell';

const record: WeatherDayRecord = {
  date: '2020-09-15',
  year: 2020,
  hasData: true,
  windSpeedMax: 16.4,
  windDirection: 180,
};

const meta = {
  title: 'Components/WindCell',
  component: WindCell,
  args: {
    record,
  },
} satisfies Meta<typeof WindCell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithDirection: Story = {};

export const WithoutDirection: Story = {
  args: {
    record: {
      ...record,
      windDirection: undefined,
    },
  },
};

export const NoData: Story = {
  args: {
    record: {
      date: '2020-09-15',
      year: 2020,
      hasData: false,
      noDataReason: 'api_error',
    },
  },
};
