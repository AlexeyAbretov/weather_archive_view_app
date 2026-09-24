import { describe, expect, it, vi } from 'vitest';

import { location } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { ModeBViewContainer } from '../ModeBViewContainer';

vi.mock('@hooks', () => ({
  useSelectedLocation: () => ({ location }),
  useModeBLazyWeather: () => ({
    years: [2020],
    windowsByYear: new Map(),
    loadingYears: new Set(),
    errorYears: new Map(),
    expandedYears: [],
    setExpandedYears: vi.fn(),
    loadYear: vi.fn(),
    reloadYear: vi.fn(),
    isYearExpandable: () => true,
  }),
}));

describe('ModeBViewContainer', () => {
  it('передаёт годы в таблицу', () => {
    const { container } = renderWithLocale(
      <ModeBViewContainer anchorDate={{ year: 2020, month: 9, day: 15 }} />,
    );

    expect(container).toMatchSnapshot();
  });
});
