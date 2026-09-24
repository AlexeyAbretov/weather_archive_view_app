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
    expect(screen.getByText('дождь')).toBeInTheDocument();
    expect(screen.getByText('16 км/ч')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    rerender(<YearColumnsTable data={[]} loading />);
    rerender(<YearColumnsTable data={[]} />);

    expect(container).toMatchSnapshot();
  });
});
