import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocale } from '../../../../test/render';
import { CitySelectorContainer } from '../CitySelectorContainer';

const state = vi.hoisted(() => ({
  clearLocation: vi.fn(),
  detectLocation: vi.fn(),
  location: null as {
    name: string;
    label: string;
    lat: number;
    lon: number;
  } | null,
  searchInitialQuery: '',
  setLocation: vi.fn(),
  setQuery: vi.fn(),
}));

vi.mock('@hooks', () => ({
  useSelectedLocation: () => ({
    location: state.location,
    setLocation: state.setLocation,
    clearLocation: state.clearLocation,
  }),
  useCitySearch: (initialQuery = '') => {
    state.searchInitialQuery = initialQuery;

    return {
      query: 'Мо',
      setQuery: state.setQuery,
      results: [
        {
          name: 'Москва',
          lat: 55.75,
          lon: 37.62,
          label: 'Москва, Москва, Россия',
        },
      ],
      status: 'idle',
      errorMessage: null,
    };
  },
  useGeolocation: () => ({
    isLocating: false,
    detectLocation: state.detectLocation,
  }),
}));

describe('CitySelectorContainer', () => {
  beforeEach(() => {
    state.clearLocation.mockReset();
    state.detectLocation.mockReset();
    state.location = null;
    state.searchInitialQuery = '';
    state.setLocation.mockReset();
    state.setQuery.mockReset();
  });

  it('связывает поиск, выбор и геолокацию', async () => {
    const user = userEvent.setup();
    const { container } = renderWithLocale(<CitySelectorContainer />);

    expect(container).toMatchSnapshot();
    expect(state.searchInitialQuery).toBe('');

    await user.type(screen.getAllByRole('combobox')[0], 'с');
    expect(state.setQuery).toHaveBeenCalled();

    fireEvent.click(
      document.querySelector('.ant-select-item-option') as HTMLElement,
    );

    expect(state.setLocation).toHaveBeenCalledWith({
      name: 'Москва',
      label: 'Москва, Москва, Россия',
      lat: 55.75,
      lon: 37.62,
    });
    expect(state.setQuery).toHaveBeenCalledWith('Москва, Москва, Россия');

    state.detectLocation.mockResolvedValueOnce(null);

    await user.click(
      screen.getByRole('button', { name: /Моё местоположение/ }),
    );

    expect(state.setLocation).toHaveBeenCalledTimes(1);

    state.detectLocation.mockResolvedValueOnce({
      name: 'Тула',
      label: 'Тула',
      lat: 54.2,
      lon: 37.6,
    });

    await user.click(
      screen.getByRole('button', { name: /Моё местоположение/ }),
    );

    expect(state.setLocation).toHaveBeenCalledWith({
      name: 'Тула',
      label: 'Тула',
      lat: 54.2,
      lon: 37.6,
    });
    expect(state.setQuery).toHaveBeenCalledWith('Тула');
  });

  it('подставляет сохранённый город в поле поиска', () => {
    state.location = {
      name: 'Казань',
      label: 'Казань, Татарстан, Россия',
      lat: 55.79,
      lon: 49.12,
    };

    const { container } = renderWithLocale(<CitySelectorContainer />);

    expect(state.searchInitialQuery).toBe('Казань, Татарстан, Россия');
    expect(screen.getByText('Казань')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it('очищает выбранный город', () => {
    state.location = {
      name: 'Казань',
      label: 'Казань, Татарстан, Россия',
      lat: 55.79,
      lon: 49.12,
    };

    const { container } = renderWithLocale(<CitySelectorContainer />);

    fireEvent.mouseDown(
      container.querySelector('.ant-select-clear') as HTMLElement,
    );

    expect(state.clearLocation).toHaveBeenCalled();
    expect(state.setQuery).toHaveBeenCalledWith('');
  });
});
