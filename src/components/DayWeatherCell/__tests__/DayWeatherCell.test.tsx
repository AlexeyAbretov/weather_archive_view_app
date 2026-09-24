import { describe, expect, it } from 'vitest';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { DayWeatherCell } from '../DayWeatherCell';

describe('DayWeatherCell', () => {
  it('показывает день с данными и без них', () => {
    const { container, rerender } = renderWithLocale(
      <DayWeatherCell record={weatherDay()} />,
    );

    expect(container).toMatchSnapshot();

    rerender(<DayWeatherCell record={noDataDay()} />);

    expect(container).toMatchSnapshot();
  });
});
