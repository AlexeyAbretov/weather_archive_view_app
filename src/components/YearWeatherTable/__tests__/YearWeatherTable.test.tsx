import { describe, expect, it } from 'vitest';

import { weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { YearWeatherTable } from '../YearWeatherTable';

describe('YearWeatherTable', () => {
  it('показывает строки, загрузку и пустую таблицу', () => {
    const { container, rerender } = renderWithLocale(
      <YearWeatherTable data={[{ year: 2020, day: weatherDay() }]} />,
    );

    expect(container).toMatchSnapshot();

    rerender(<YearWeatherTable data={[]} loading />);
    rerender(<YearWeatherTable data={[]} />);

    expect(container).toMatchSnapshot();
  });
});
