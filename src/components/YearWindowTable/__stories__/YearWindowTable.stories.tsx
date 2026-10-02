import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { WeatherDayRecord, YearWeatherWindow } from '@domain';

import { YearWindowTable } from '../YearWindowTable';

const TEMPERATURES: Array<[number, number]> = [
  [2, 11],
  [3, 12],
  [1, 10],
  [4, 13],
  [6, 15],
  [5, 14],
  [4, 16],
  [7, 18],
  [8, 17],
  [6, 15],
  [3, 12],
  [2, 11],
  [1, 9],
  [0, 8],
  [2, 10],
];

const PRECIPITATION_MM = [
  0, 0.4, 1.2, 0, 3.5, 8, 2.1, 0.6, 0, 4.2, 1.1, 0, 0.2, 6.4, 0.8,
];

const days: WeatherDayRecord[] = TEMPERATURES.map(
  ([tempMin, tempMax], index) => {
    const day = index + 8;

    return {
      date: `2020-09-${String(day).padStart(2, '0')}`,
      year: 2020,
      hasData: true,
      tempMin,
      tempMax,
      precipitationMm: PRECIPITATION_MM[index] ?? 0,
      precipitationType: 'rain',
      windSpeedMax: 8 + index,
      windDirection: 20 * index,
      cloudCover: 10 + index * 5,
      weatherCode: 61,
      iconKey: 'rain',
    };
  },
);

const windowByYear = new Map<number, YearWeatherWindow>([
  [2020, { year: 2020, days }],
]);

const meta = {
  title: 'Components/YearWindowTable',
  component: YearWindowTable,
  args: {
    anchorYear: 2020,
    years: [2019, 2020],
    windowsByYear: new Map(),
    loadingYears: new Set<number>(),
    errorYears: new Map(),
    expandedYears: [],
    onExpandedYearsChange: fn(),
    onExpandYear: fn(),
    onRetryYear: fn(),
    isYearExpandable: (year: number) => year !== 2019,
  },
} satisfies Meta<typeof YearWindowTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};

export const Expanded: Story = {
  args: {
    expandedYears: [2020],
    windowsByYear: windowByYear,
  },
};

export const LoadingYear: Story = {
  args: {
    expandedYears: [2020],
    loadingYears: new Set([2020]),
  },
};

export const ErrorYear: Story = {
  args: {
    expandedYears: [2020],
    errorYears: new Map([[2020, new Error('Сеть')]]),
  },
};
