import { describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { location, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { ModeAView } from '../ModeAView';

const row = { year: 2020, day: weatherDay() };

describe('ModeAView', () => {
  it('показывает пустое место, загрузку, ошибку и таблицу', async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();
    const { container, rerender } = renderWithLocale(
      <ModeAView
        data={[]}
        error={null}
        loading={false}
        location={null}
        onReload={onReload}
      />,
    );

    expect(
      screen.getByText('Выберите город и дату для просмотра архива'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    rerender(
      <ModeAView
        data={[]}
        error={null}
        loading
        location={location}
        onReload={onReload}
      />,
    );

    expect(document.querySelector('.ant-spin')).toBeTruthy();

    rerender(
      <ModeAView
        data={[]}
        error={new Error('сеть')}
        loading={false}
        location={location}
        onReload={onReload}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Повторить' }));
    expect(onReload).toHaveBeenCalled();

    rerender(
      <ModeAView
        data={[row]}
        error={null}
        loading={false}
        location={location}
        onReload={onReload}
      />,
    );

    expect(screen.getByText('2020')).toBeInTheDocument();
  });
});
