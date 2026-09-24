import { describe, expect, it } from 'vitest';

import type { PrecipitationType } from '@domain';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { PrecipitationCell } from '../PrecipitationCell';
import { getPrecipitationLabel } from '../PrecipitationLabels';

const types: PrecipitationType[] = [
  'none',
  'rain',
  'snow',
  'mixed',
  'drizzle',
  'freezing_rain',
  'thunderstorm',
  'hail',
];

describe('PrecipitationCell', () => {
  it('подписывает тип осадков', () => {
    expect(getPrecipitationLabel(undefined)).toBe('—');

    types.forEach((type) => {
      expect(getPrecipitationLabel(type).length).toBeGreaterThan(0);
    });
  });

  it('показывает осадки и отсутствие данных', () => {
    const { container, rerender } = renderWithLocale(
      <PrecipitationCell record={weatherDay()} />,
    );

    expect(container).toMatchSnapshot();

    rerender(<PrecipitationCell record={noDataDay('future')} />);

    expect(container).toMatchSnapshot();
  });
});
