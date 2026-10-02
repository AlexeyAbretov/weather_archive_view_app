import { describe, expect, it } from 'vitest';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { TemperatureCell } from '../TemperatureCell';

describe('TemperatureCell', () => {
  it('показывает диапазон и отсутствие данных', () => {
    const { container, rerender } = renderWithLocale(
      <TemperatureCell record={weatherDay()} />,
    );

    expect(container).toMatchSnapshot();

    rerender(<TemperatureCell record={noDataDay()} />);

    expect(container).toMatchSnapshot();
  });
});
