import { describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';

import { location } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { ModeBView } from '../ModeBView';

const props = {
  errorYears: new Map<number, Error>(),
  expandedYears: [],
  isYearExpandable: () => true,
  loadingYears: new Set<number>(),
  onExpandYear: vi.fn(),
  onExpandedYearsChange: vi.fn(),
  onRetryYear: vi.fn(),
  windowsByYear: new Map(),
  years: [2020],
};

describe('ModeBView', () => {
  it('просит выбрать город или показывает годы', () => {
    const { container, rerender } = renderWithLocale(
      <ModeBView {...props} location={null} />,
    );

    expect(
      screen.getByText('Выберите город и дату для просмотра архива'),
    ).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    rerender(<ModeBView {...props} location={location} />);

    expect(screen.getByText('2020')).toBeInTheDocument();
  });
});
