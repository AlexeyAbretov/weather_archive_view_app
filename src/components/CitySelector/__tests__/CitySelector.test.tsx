import { describe, expect, it, vi } from 'vitest';

import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { location } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { CitySelector } from '../CitySelector';

const city = {
  ...location,
  label: 'Москва, Москва, Россия',
};

describe('CitySelector', () => {
  it('показывает пустое состояние и выбранный город', () => {
    const { container, rerender } = renderWithLocale(
      <CitySelector
        errorMessage={null}
        isLocating={false}
        location={null}
        onDetectLocation={vi.fn()}
        onQueryChange={vi.fn()}
        onSelect={vi.fn()}
        query=""
        results={[]}
        status="idle"
      />,
    );

    expect(screen.getByText(/Выберите город из списка/)).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    rerender(
      <CitySelector
        errorMessage={null}
        isLocating
        location={city}
        onDetectLocation={vi.fn()}
        onQueryChange={vi.fn()}
        onSelect={vi.fn()}
        query={city.label}
        results={[city]}
        status="idle"
      />,
    );

    expect(screen.getByText('Москва')).toBeInTheDocument();
  });

  it('передаёт запрос, выбор и геолокацию', async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();
    const onSelect = vi.fn();
    const onDetectLocation = vi.fn();

    renderWithLocale(
      <CitySelector
        errorMessage="Сеть"
        isLocating={false}
        location={null}
        onDetectLocation={onDetectLocation}
        onQueryChange={onQueryChange}
        onSelect={onSelect}
        query="Мо"
        results={[city]}
        status="error"
      />,
    );

    await user.type(screen.getAllByRole('combobox')[0], 'с');
    expect(onQueryChange).toHaveBeenCalled();

    fireEvent.click(
      document.querySelector('.ant-select-item-option') as HTMLElement,
    );
    expect(onSelect).toHaveBeenCalledWith(city);

    await user.click(
      screen.getByRole('button', { name: /Моё местоположение/ }),
    );
    expect(onDetectLocation).toHaveBeenCalled();
  });

  it('показывает загрузку и пустой поиск', () => {
    const { rerender } = renderWithLocale(
      <CitySelector
        errorMessage={null}
        isLocating={false}
        location={null}
        onDetectLocation={vi.fn()}
        onQueryChange={vi.fn()}
        onSelect={vi.fn()}
        query="Мо"
        results={[]}
        status="loading"
      />,
    );

    expect(screen.getAllByRole('combobox')[0]).toBeInTheDocument();

    rerender(
      <CitySelector
        errorMessage={null}
        isLocating={false}
        location={null}
        onDetectLocation={vi.fn()}
        onQueryChange={vi.fn()}
        onSelect={vi.fn()}
        query="Ыы"
        results={[]}
        status="empty"
      />,
    );

    expect(screen.getAllByRole('combobox')[0]).toHaveValue('Ыы');
  });
});
