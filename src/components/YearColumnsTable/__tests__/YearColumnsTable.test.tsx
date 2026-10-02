import { describe, expect, it } from 'vitest';

import { screen } from '@testing-library/react';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { YearColumnsTable } from '../YearColumnsTable';

describe('YearColumnsTable', () => {
  it('показывает годы в заголовке и показатели строками', () => {
    const { container, rerender } = renderWithLocale(
      <YearColumnsTable
        anchorYear={2020}
        data={[
          {
            year: 2019,
            day: weatherDay({
              date: '2019-09-15',
              year: 2019,
              tempMin: 0,
              tempMax: 5,
            }),
          },
          { year: 2020, day: weatherDay() },
          { year: 2021, day: noDataDay('future') },
        ]}
      />,
    );

    expect(
      screen.getByRole('columnheader', { name: '2020' }).className,
    ).toContain('anchorColumn');
    expect(
      screen.getByRole('columnheader', { name: '2021' }).className,
    ).not.toContain('anchorColumn');
    expect(screen.queryByText('Показатель')).not.toBeInTheDocument();
    expect(screen.queryByText('Осадки')).not.toBeInTheDocument();
    expect(screen.getByText('+5°')).toBeInTheDocument();
    expect(screen.getByText('+17°')).toBeInTheDocument();
    expect(screen.getByText('-1°')).toBeInTheDocument();
    expect(container.querySelectorAll('[data-band]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-join]')).toHaveLength(2);
    expect(
      [...container.querySelectorAll('[data-band]')].filter(
        (band) => band.getAttribute('fill') === 'rgb(105, 192, 255)',
      ),
    ).toHaveLength(2);
    expect(screen.getAllByText('1.2 мм')).toHaveLength(2);
    expect(screen.queryByText('дождь')).not.toBeInTheDocument();
    expect(screen.getAllByText('16 км/ч')).toHaveLength(2);
    expect(screen.getAllByText('40%')).toHaveLength(2);
    expect(container).toMatchSnapshot();

    rerender(<YearColumnsTable data={[]} loading />);
    rerender(<YearColumnsTable data={[]} />);

    expect(container).toMatchSnapshot();
  });
});
