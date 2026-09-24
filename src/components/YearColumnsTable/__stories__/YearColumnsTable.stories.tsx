import type { Meta, StoryObj } from '@storybook/react-vite';

import type { YearWeatherRow } from '@domain';

import { YearColumnsTable } from '../YearColumnsTable';

const withData = (year: number): YearWeatherRow => {
  return {
    year,
    day: {
      date: `${year}-09-15`,
      year,
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
};

const withoutData: YearWeatherRow = {
  year: 2026,
  day: {
    date: '2026-09-15',
    year: 2026,
    hasData: false,
    noDataReason: 'future',
  },
};

const meta = {
  title: 'Components/YearColumnsTable',
  component: YearColumnsTable,
  args: {
    anchorYear: 2020,
    data: [withData(2019), withData(2020), withoutData],
  },
} satisfies Meta<typeof YearColumnsTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithYears: Story = {};

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
