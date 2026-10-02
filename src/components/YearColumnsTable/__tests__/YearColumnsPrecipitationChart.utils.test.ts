import { describe, expect, it } from 'vitest';

import type { YearWeatherRow } from '@domain';

import { buildPrecipitationChart } from '../YearColumnsPrecipitationChart';

const row = (
  year: number,
  precipitationMm?: number,
  hasData = true,
): YearWeatherRow => {
  return {
    year,
    day: {
      date: `${year}-09-15`,
      year,
      hasData,
      precipitationMm,
      noDataReason: hasData ? undefined : 'future',
    },
  };
};

describe('buildPrecipitationChart', () => {
  it('строит полосу от нуля до количества осадков одним цветом', () => {
    const chart = buildPrecipitationChart([row(2018, 0), row(2019, 10)], 2019);
    const dry = chart.segments[0];
    const wet = chart.segments[1];

    expect(dry?.band?.top).toBe(60);
    expect(dry?.band?.height).toBe(0);
    expect(wet?.band?.top).toBe(16);
    expect(wet?.band?.height).toBe(44);
    expect(dry?.band?.fill).toBe('rgb(140, 140, 140)');
    expect(dry?.band?.stroke).toBe('rgb(140, 140, 140)');
    expect(wet?.band?.fill).toBe('rgb(105, 192, 255)');
    expect(wet?.band?.stroke).toBe('rgb(9, 109, 217)');
    expect(dry?.labels[0]?.text).toBe('0 мм');
    expect(wet?.labels[0]?.text).toBe('10.0 мм');
    expect(wet?.labels[0]?.top).toBeLessThan(wet?.band?.top ?? 0);
    expect(wet?.tooltip).toBe('2019: 10.0 мм');
    expect(wet?.isAnchor).toBe(true);
    expect(dry?.isAnchor).toBe(false);
  });

  it('рисует ноль линией на нуле и не опускается ниже', () => {
    const zeros = buildPrecipitationChart([row(2020, 0), row(2021, -3)]);
    const negative = buildPrecipitationChart([row(2019, -1), row(2020, 10)]);

    expect(zeros.segments[0]?.band?.top).toBe(60);
    expect(zeros.segments[0]?.band?.height).toBe(0);
    expect(zeros.segments[1]?.band?.height).toBe(0);
    expect(zeros.segments[0]?.labels[0]?.text).toBe('0 мм');
    expect(zeros.segments[1]?.labels[0]?.text).toBe('0 мм');
    expect(negative.segments[0]?.band).toEqual({
      top: 60,
      height: 0,
      fill: 'rgb(140, 140, 140)',
      stroke: 'rgb(140, 140, 140)',
    });
    expect(negative.segments[0]?.labels[0]?.text).toBe('0 мм');
    expect(negative.segments[1]?.band?.top).toBe(16);
    expect(negative.segments[1]?.band?.height).toBe(44);
  });

  it('оставляет пиксель полосы у малого положительного значения', () => {
    const chart = buildPrecipitationChart([row(2018, 0.01), row(2019, 100)]);
    const band = chart.segments[0]?.band;

    expect(band?.top).toBe(59);
    expect(band?.height).toBe(1);
    expect((band?.top ?? 0) + (band?.height ?? 0)).toBe(60);
  });

  it('оставляет пропуск без количества осадков', () => {
    const chart = buildPrecipitationChart([
      row(2020, 1.2),
      row(2021, undefined),
      row(2022, undefined, false),
    ]);

    expect(chart.segments[1]?.band).toBeUndefined();
    expect(chart.segments[1]?.emptyLabel).toBe('—');
    expect(chart.segments[2]?.emptyLabel).toBe('нет данных');
    expect(chart.segments[2]?.tooltip).toBe('2022: нет данных');
  });

  it('не строит шкалу, если данных нет', () => {
    expect(buildPrecipitationChart([]).segments).toEqual([]);
    expect(buildPrecipitationChart([]).height).toBe(64);
  });

  it('подписывает годы, если осадков нет ни у одного', () => {
    const chart = buildPrecipitationChart([row(2024, undefined, false)]);

    expect(chart.segments[0]?.band).toBeUndefined();
    expect(chart.segments[0]?.emptyLabel).toBe('нет данных');
  });
});
