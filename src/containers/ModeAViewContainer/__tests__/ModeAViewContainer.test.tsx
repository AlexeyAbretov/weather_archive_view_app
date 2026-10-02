import { describe, expect, it, vi } from 'vitest';

import { location, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { ModeAViewContainer } from '../ModeAViewContainer';

const reload = vi.hoisted(() => vi.fn());

vi.mock('@hooks', () => ({
  useSelectedLocation: () => ({ location }),
  useModeAWeather: () => ({
    data: [{ year: 2020, day: weatherDay() }],
    loading: false,
    error: null,
    reload,
  }),
}));

describe('ModeAViewContainer', () => {
  it('передаёт архив в таблицу', () => {
    const { container } = renderWithLocale(
      <ModeAViewContainer anchorDate={{ year: 2020, month: 9, day: 15 }} />,
    );

    expect(container).toMatchSnapshot();
  });
});
