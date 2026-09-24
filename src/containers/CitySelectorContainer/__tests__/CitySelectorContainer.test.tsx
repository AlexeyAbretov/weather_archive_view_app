import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocale } from '../../../../test/render';
import { CitySelectorContainer } from '../CitySelectorContainer';

const state = vi.hoisted(() => ({
  detectLocation: vi.fn(),
  setLocation: vi.fn(),
  setQuery: vi.fn(),
}));

vi.mock('@hooks', () => ({
  useSelectedLocation: () => ({
    location: null,
    setLocation: state.setLocation,
  }),
  useCitySearch: () => ({
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
  }),
  useGeolocation: () => ({
    isLocating: false,
    detectLocation: state.detectLocation,
  }),
}));

describe('CitySelectorContainer', () => {
  beforeEach(() => {
    state.detectLocation.mockReset();
    state.setLocation.mockReset();
    state.setQuery.mockReset();
  });

  it('связывает поиск, выбор и геолокацию', async () => {
    const user = userEvent.setup();
    const { container } = renderWithLocale(<CitySelectorContainer />);

    expect(container).toMatchSnapshot();

    await user.type(screen.getAllByRole('combobox')[0], 'с');
    expect(state.setQuery).toHaveBeenCalled();

    fireEvent.click(
      document.querySelector('.ant-select-item-option') as HTMLElement,
    );

    expect(state.setLocation).toHaveBeenCalledWith({
      name: 'Москва',
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
      lat: 54.2,
      lon: 37.6,
    });

    await user.click(
      screen.getByRole('button', { name: /Моё местоположение/ }),
    );

    expect(state.setLocation).toHaveBeenCalledWith({
      name: 'Тула',
      lat: 54.2,
      lon: 37.6,
    });
    expect(state.setQuery).toHaveBeenCalledWith('Тула');
  });
});
