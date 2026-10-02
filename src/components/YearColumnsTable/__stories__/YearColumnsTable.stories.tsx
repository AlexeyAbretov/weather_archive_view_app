import type { Meta, StoryObj } from '@storybook/react-vite';

import type { YearWeatherRow } from '@domain';

import { YearColumnsTable } from '../YearColumnsTable';

const TEMPERATURES: Array<[number, number]> = [
  [0, 13],
  [5, 12],
  [3, 15],
  [9, 13],
  [8, 13],
  [10, 15],
  [11, 16],
  [9, 14],
  [7, 11],
  [7, 12],
];

const PRECIPITATION_MM = [0, 1.2, 4.8, 0.3, 8, 2.5, 0.6, 6.1, 3, 1.4];

const withData = (
  year: number,
  tempMin: number,
  tempMax: number,
  precipitationMm: number,
): YearWeatherRow => {
  return {
    year,
    day: {
      date: `${year}-09-15`,
      year,
      hasData: true,
      tempMin,
      tempMax,
      precipitationMm,
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
    data: [
      ...TEMPERATURES.map(([tempMin, tempMax], index) =>
        withData(2016 + index, tempMin, tempMax, PRECIPITATION_MM[index] ?? 0),
      ),
      withoutData,
    ],
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
