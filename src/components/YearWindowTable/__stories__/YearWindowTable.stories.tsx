import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import type { WeatherDayRecord, YearWeatherWindow } from '@domain';

import { YearWindowTable } from '../YearWindowTable';

const day: WeatherDayRecord = {
  date: '2020-09-15',
  year: 2020,
  hasData: true,
  tempMin: 4,
  tempMax: 16,
  precipitationMm: 0,
  precipitationType: 'none',
  windSpeedMax: 8,
  windDirection: 10,
  cloudCover: 5,
  weatherCode: 1,
  iconKey: 'mainly-clear',
};

const windowByYear = new Map<number, YearWeatherWindow>([
  [2020, { year: 2020, days: [day] }],
]);

const meta = {
  title: 'Components/YearWindowTable',
  component: YearWindowTable,
  args: {
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
