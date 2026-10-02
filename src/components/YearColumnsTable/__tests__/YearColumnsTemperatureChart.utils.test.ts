import { describe, expect, it } from 'vitest';

import type { YearWeatherRow } from '@domain';

import { buildTemperatureChart } from '../YearColumnsTemperatureChart.utils';

const row = (
  year: number,
  tempMin?: number,
  tempMax?: number,
  hasData = true,
): YearWeatherRow => {
  return {
    year,
    day: {
      date: `${year}-09-15`,
      year,
      hasData,
      tempMin,
      tempMax,
      noDataReason: hasData ? undefined : 'future',
    },
  };
};

describe('buildTemperatureChart', () => {
  it('красит полосу по отклонению средней температуры года', () => {
    const chart = buildTemperatureChart(
      [row(2018, 8, 12), row(2019, 12, 16)],
      2019,
    );
    const cold = chart.segments[0];
    const warm = chart.segments[1];

    expect(cold?.band?.fill).toBe('rgb(192, 233, 212)');
    expect(cold?.band?.stroke).toBe('rgb(74, 168, 171)');
    expect(warm?.band?.fill).toBe('rgb(227, 223, 184)');
    expect(warm?.band?.stroke).toBe('rgb(167, 118, 61)');
    expect(cold?.tooltip).toBe('2018: +12° / +8°, отклонение -2.0°');
    expect(warm?.isAnchor).toBe(true);
    expect(cold?.isAnchor).toBe(false);
    expect(cold?.labelMaxTop).toBeLessThan(cold?.band?.top ?? 0);
    expect(cold?.labelMinTop).toBeGreaterThan(
      (cold?.band?.top ?? 0) + (cold?.band?.height ?? 0),
    );
  });

  it('упирает цвет в край шкалы при большом отклонении', () => {
    const chart = buildTemperatureChart([row(2018, -2, 2), row(2019, 14, 18)]);

    expect(chart.segments[0]?.band?.fill).toBe('rgb(186, 224, 255)');
    expect(chart.segments[0]?.band?.stroke).toBe('rgb(22, 119, 255)');
    expect(chart.segments[1]?.band?.fill).toBe('rgb(255, 204, 199)');
    expect(chart.segments[1]?.band?.stroke).toBe('rgb(207, 19, 34)');
  });

  it('рисует тонкую зелёную полосу, если температуры совпали', () => {
    const chart = buildTemperatureChart([row(2020, 10, 10)]);
    const band = chart.segments[0]?.band;

    expect(band?.fill).toBe('rgb(198, 242, 168)');
    expect(band?.stroke).toBe('rgb(126, 217, 87)');
    expect(band?.top).toBe(43);
    expect(band?.height).toBe(3);
    expect(chart.segments[0]?.tooltip).toContain('отклонение 0.0°');
  });

  it('оставляет пропуск без температуры', () => {
    const chart = buildTemperatureChart([
      row(2020, 1, 3),
      row(2021, undefined, 10),
      row(2022, 4, undefined),
      row(2023, undefined, undefined, false),
    ]);

    expect(chart.segments[1]?.band).toBeUndefined();
    expect(chart.segments[1]?.emptyLabel).toBe('—');
    expect(chart.segments[2]?.emptyLabel).toBe('—');
    expect(chart.segments[3]?.emptyLabel).toBe('нет данных');
    expect(chart.segments[3]?.tooltip).toBe('2023: нет данных');
  });

  it('не строит шкалу, если данных нет', () => {
    const chart = buildTemperatureChart([]);

    expect(chart.segments).toEqual([]);
    expect(chart.height).toBe(90);
  });

  it('подписывает годы, если температуры нет ни у одного', () => {
    const chart = buildTemperatureChart([
      row(2024, undefined, undefined, false),
    ]);

    expect(chart.segments[0]?.band).toBeUndefined();
    expect(chart.segments[0]?.emptyLabel).toBe('нет данных');
  });
});
