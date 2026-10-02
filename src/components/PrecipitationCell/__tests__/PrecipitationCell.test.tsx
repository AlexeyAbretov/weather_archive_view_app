import { describe, expect, it } from 'vitest';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { PrecipitationCell } from '../PrecipitationCell';

describe('PrecipitationCell', () => {
  it('показывает осадки и отсутствие данных', () => {
    const { container, rerender } = renderWithLocale(
      <PrecipitationCell record={weatherDay()} />,
    );

    expect(container).toMatchSnapshot();

    rerender(<PrecipitationCell record={noDataDay('future')} />);

    expect(container).toMatchSnapshot();
  });
});
