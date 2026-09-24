import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ModeBView } from '../ModeBView';

const location = { name: 'Москва', lat: 55.752, lon: 37.6178 };

const meta = {
  title: 'Components/ModeBView',
  component: ModeBView,
  args: {
    errorYears: new Map(),
    expandedYears: [],
    isYearExpandable: fn(() => true),
    loadingYears: new Set<number>(),
    location,
    onExpandYear: fn(),
    onExpandedYearsChange: fn(),
    onRetryYear: fn(),
    windowsByYear: new Map(),
    years: [2019, 2020, 2021],
  },
} satisfies Meta<typeof ModeBView>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithYears: Story = {};

export const EmptyLocation: Story = {
  args: {
    location: null,
  },
};
