import type { Meta, StoryObj } from '@storybook/react-vite';

import type { WeatherDayRecord } from '@domain';

import { WeatherIcon } from '../WeatherIcon';

const base: WeatherDayRecord = {
  date: '2020-09-15',
  year: 2020,
  hasData: true,
  weatherCode: 0,
  cloudCover: 12,
};

const meta = {
  title: 'Components/WeatherIcon',
  component: WeatherIcon,
  args: {
    record: { ...base, iconKey: 'clear' },
  },
} satisfies Meta<typeof WeatherIcon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Clear: Story = {};

export const Rain: Story = {
  args: { record: { ...base, iconKey: 'rain', weatherCode: 61 } },
};

export const Snow: Story = {
  args: { record: { ...base, iconKey: 'snow', weatherCode: 71 } },
};

export const Storm: Story = {
  args: {
    record: { ...base, iconKey: 'thunderstorm', weatherCode: 95 },
  },
};

export const Cloud: Story = {
  args: { record: { ...base, iconKey: 'overcast', weatherCode: 3 } },
};

export const Unknown: Story = {
  args: { record: { ...base, iconKey: 'unknown', cloudCover: undefined } },
};

export const NoData: Story = {
  args: {
    record: {
      date: '2020-09-15',
      year: 2020,
      hasData: false,
      noDataReason: 'feb29',
    },
  },
};
