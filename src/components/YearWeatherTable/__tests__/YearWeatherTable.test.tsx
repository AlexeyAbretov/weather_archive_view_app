import { describe, expect, it } from 'vitest';

import { screen } from '@testing-library/react';

import { weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { YearWeatherTable } from '../YearWeatherTable';

describe('YearWeatherTable', () => {
  it('показывает строки, загрузку и пустую таблицу', () => {
    const { container, rerender } = renderWithLocale(
      <YearWeatherTable
        anchorYear={2020}
        data={[
          { year: 2019, day: weatherDay({ year: 2019, date: '2019-09-15' }) },
          { year: 2020, day: weatherDay() },
        ]}
      />,
    );

    expect(screen.getByRole('row', { name: /2020/ }).className).toContain(
      'anchorRow',
    );
    expect(screen.getByRole('row', { name: /2019/ }).className).not.toContain(
      'anchorRow',
    );
    expect(container).toMatchSnapshot();

    rerender(<YearWeatherTable data={[]} loading />);
    rerender(<YearWeatherTable data={[]} />);

    expect(container).toMatchSnapshot();
  });
});
