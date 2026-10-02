import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { CitySelector } from '../CitySelector';

const city = {
  name: 'Москва',
  lat: 55.752,
  lon: 37.6178,
  label: 'Москва, Москва, Россия',
};

const meta = {
  title: 'Components/CitySelector',
  component: CitySelector,
  args: {
    errorMessage: null,
    isLocating: false,
    location: null,
    onClear: fn(),
    onDetectLocation: fn(),
    onQueryChange: fn(),
    onSelect: fn(),
    query: '',
    results: [],
    status: 'idle',
  },
} satisfies Meta<typeof CitySelector>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Selected: Story = {
  args: {
    location: city,
    query: city.label,
  },
};

export const Locating: Story = {
  args: {
    isLocating: true,
  },
};

export const Loading: Story = {
  args: {
    query: 'Мо',
    status: 'loading',
  },
};

export const ErrorState: Story = {
  args: {
    errorMessage: 'Не удалось выполнить поиск',
    query: 'Мо',
    status: 'error',
  },
};

export const NoResults: Story = {
  args: {
    query: 'Ыыы',
    status: 'empty',
  },
};
