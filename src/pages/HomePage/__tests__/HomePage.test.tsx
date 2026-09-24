import { describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocale } from '../../../../test/render';
import { HomePage } from '../HomePage';

vi.mock('@hooks', () => ({
  useWeatherAppState: () => ({
    anchorDate: { year: 2020, month: 9, day: 15 },
    setAnchorDate: vi.fn(),
    yearRangeLabel: '2010–2030',
  }),
  useSelectedLocation: () => ({
    location: {
      name: 'Москва',
      label: 'Москва, Москва, Россия',
      lat: 55.75,
      lon: 37.62,
    },
    setLocation: vi.fn(),
  }),
  useCitySearch: () => ({
    query: '',
    setQuery: vi.fn(),
    results: [],
    status: 'idle',
    errorMessage: null,
  }),
  useGeolocation: () => ({
    isLocating: false,
    detectLocation: vi.fn(),
  }),
  useModeAWeather: () => ({
    data: [],
    loading: false,
    error: null,
    reload: vi.fn(),
  }),
  useModeBLazyWeather: () => ({
    years: [2020],
    windowsByYear: new Map(),
    loadingYears: new Set(),
    errorYears: new Map(),
    expandedYears: [],
    setExpandedYears: vi.fn(),
    loadYear: vi.fn(),
    reloadYear: vi.fn(),
    isYearExpandable: () => true,
  }),
}));

describe('HomePage', () => {
  it('показывает режимы A и B', async () => {
    const user = userEvent.setup();
    const { container } = renderWithLocale(<HomePage />);

    expect(screen.getByText(/Прокрутите таблицу/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    await user.click(screen.getByText('По неделям (B)'));

    expect(screen.getByText(/Раскройте строку года/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
