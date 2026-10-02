import { describe, expect, it, vi } from 'vitest';

import { fireEvent, screen } from '@testing-library/react';
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
  anchorYear: 2020,
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
    expect(screen.getByRole('row', { name: /2020/ }).className).toContain(
      'anchorRow',
    );
    expect(screen.getByRole('row', { name: /2019/ }).className).not.toContain(
      'anchorRow',
    );
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

    expect(
      document.querySelector('.ant-table-expanded-row')?.className,
    ).toContain('anchorExpandedRow');
    expect(document.body.textContent).toContain('10.09');
    expect(document.body.textContent).toContain('18.09');
    expect(document.body.textContent).not.toContain('дн. до');
    expect(document.body.textContent).not.toContain('дн. после');
    expect(
      screen.getByRole('columnheader', { name: '17.09' }).className,
    ).toContain('anchorColumn');
    expect(screen.getAllByText('+17°').length).toBeGreaterThan(0);
    expect(screen.getAllByText('-1°').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1.2 мм').length).toBeGreaterThan(0);
    expect(screen.getAllByText('16 км/ч')).toHaveLength(9);
    expect(screen.getAllByText('40%')).toHaveLength(9);
    expect(container.querySelectorAll('[data-band]').length).toBeGreaterThan(0);

    rerender(
      <YearWindowTable
        {...base}
        expandedYears={[2020]}
        onExpandYear={onExpandYear}
        onExpandedYearsChange={onExpandedYearsChange}
        onRetryYear={onRetryYear}
        windowsByYear={new Map([[2020, { year: 2020, days: [] }]])}
      />,
    );

    expect(screen.queryByText('+17°')).not.toBeInTheDocument();
  });

  it('прокручивает открытые годы вместе', () => {
    const daysFor = (year: number) =>
      Array.from({ length: 15 }, (_, index) =>
        weatherDay({
          date: `${year}-09-${String(index + 1).padStart(2, '0')}`,
          year,
        }),
      );
    const windows = (years: number[]) =>
      new Map(years.map((year) => [year, { year, days: daysFor(year) }]));
    const props = {
      ...base,
      years: [2018, 2019, 2020],
      isYearExpandable: () => true,
      expandedYears: [2018, 2019],
      windowsByYear: windows([2018, 2019]),
    };
    const { container, rerender } = renderWithLocale(
      <YearWindowTable {...props} />,
    );

    const scrollers = () => [
      ...container.querySelectorAll<HTMLElement>(
        '.ant-table-expanded-row .ant-table-content',
      ),
    ];

    const [first, second] = scrollers();

    expect(second).toBeTruthy();

    first!.scrollLeft = 140;
    fireEvent.scroll(first!);

    expect(second!.scrollLeft).toBe(140);

    rerender(
      <YearWindowTable
        {...props}
        expandedYears={[2018, 2019, 2020]}
        windowsByYear={windows([2018, 2019, 2020])}
      />,
    );

    const opened = scrollers();

    expect(opened).toHaveLength(3);
    expect(opened[2]!.scrollLeft).toBe(140);
  });
});
