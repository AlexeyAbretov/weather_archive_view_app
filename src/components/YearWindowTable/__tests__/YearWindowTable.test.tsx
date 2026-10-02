import { describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { YearWindowTable } from '../YearWindowTable';

const days = Array.from({ length: 9 }, (_, index) =>
  weatherDay({
    date: `2020-09-${String(index + 10).padStart(2, '0')}`,
  }),
);

const base = {
  years: [2019, 2020],
  windowsByYear: new Map(),
  loadingYears: new Set<number>(),
  errorYears: new Map<number, Error>(),
  expandedYears: [] as number[],
  onExpandedYearsChange: vi.fn(),
  onExpandYear: vi.fn(),
  onRetryYear: vi.fn(),
  isYearExpandable: (year: number) => year !== 2019,
};

describe('YearWindowTable', () => {
  it('раскрывает год, ошибку, загрузку и дни', async () => {
    const user = userEvent.setup();
    const onExpandYear = vi.fn();
    const onRetryYear = vi.fn();
    const onExpandedYearsChange = vi.fn();
    const { container, rerender } = renderWithLocale(
      <YearWindowTable
        {...base}
        onExpandYear={onExpandYear}
        onExpandedYearsChange={onExpandedYearsChange}
        onRetryYear={onRetryYear}
      />,
    );

    expect(screen.getByText('нет данных')).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    const expandIcons = document.querySelectorAll('.ant-table-row-expand-icon');

    await user.click(expandIcons[1] as HTMLElement);

    expect(onExpandYear).toHaveBeenCalledWith(2020);

    rerender(
      <YearWindowTable
        {...base}
        errorYears={new Map([[2020, new Error('сеть')]])}
        expandedYears={[2020]}
        onExpandYear={onExpandYear}
        onExpandedYearsChange={onExpandedYearsChange}
        onRetryYear={onRetryYear}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Повторить' }));
    expect(onRetryYear).toHaveBeenCalledWith(2020);

    rerender(
      <YearWindowTable
        {...base}
        expandedYears={[2020]}
        loadingYears={new Set([2020])}
        onExpandYear={onExpandYear}
        onExpandedYearsChange={onExpandedYearsChange}
        onRetryYear={onRetryYear}
      />,
    );

    expect(document.querySelector('.ant-spin')).toBeTruthy();

    rerender(
      <YearWindowTable
        {...base}
        expandedYears={[2020]}
        onExpandYear={onExpandYear}
        onExpandedYearsChange={onExpandedYearsChange}
        onRetryYear={onRetryYear}
        windowsByYear={new Map([[2020, { year: 2020, days }]])}
      />,
    );

    expect(document.body.textContent).toContain('дн. до');
    expect(document.body.textContent).toContain('дн. после');
  });
});
