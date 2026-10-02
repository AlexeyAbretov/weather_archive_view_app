import { beforeEach, describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { location, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { ModeAView } from '../ModeAView';

const row = { year: 2020, day: weatherDay() };

describe('ModeAView', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('показывает пустое место, загрузку, ошибку и таблицу', async () => {
    const user = userEvent.setup();
    const onReload = vi.fn();
    const { container, rerender } = renderWithLocale(
      <ModeAView
        anchorYear={2020}
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
        anchorYear={2020}
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
        anchorYear={2020}
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
        anchorYear={2020}
        data={[row]}
        error={null}
        loading={false}
        location={location}
        onReload={onReload}
      />,
    );

    expect(screen.getByRole('row', { name: /2020/ }).className).toContain(
      'anchorRow',
    );
    expect(
      screen.getByRole('columnheader', { name: 't° мин / макс' }),
    ).toBeInTheDocument();

    await user.click(screen.getByText('Годы в заголовке'));

    expect(
      screen.getByRole('columnheader', { name: '2020' }).className,
    ).toContain('anchorColumn');
    expect(screen.queryByText('Показатель')).not.toBeInTheDocument();
    expect(screen.queryByText('Осадки')).not.toBeInTheDocument();
    expect(screen.getByText('1.2 мм')).toBeInTheDocument();
    expect(screen.queryByText('дождь')).not.toBeInTheDocument();
    expect(screen.getByText('16 км/ч')).toBeInTheDocument();

    await user.click(screen.getByText('Годы в строках'));

    expect(
      screen.getByRole('columnheader', { name: 't° мин / макс' }),
    ).toBeInTheDocument();
  });

  it('запоминает вид таблицы по годам', async () => {
    const user = userEvent.setup();
    const viewProps = {
      anchorYear: 2020,
      data: [row],
      error: null,
      loading: false,
      location,
      onReload: vi.fn(),
    };
    const first = renderWithLocale(<ModeAView {...viewProps} />);

    await user.click(screen.getByText('Годы в заголовке'));
    first.unmount();

    renderWithLocale(<ModeAView {...viewProps} />);

    expect(
      screen.getByRole('columnheader', { name: '2020' }).className,
    ).toContain('anchorColumn');
  });
});
