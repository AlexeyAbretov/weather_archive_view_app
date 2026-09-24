import { describe, expect, it, vi } from 'vitest';

import { fetchModeBYear } from '@services';
import { act, renderHook } from '@testing-library/react';

import { useModeBLazyWeather } from '../useModeBLazyWeather';

vi.mock('@services', () => ({
  fetchModeBYear: vi.fn(),
}));

const anchorDate = { year: 2020, month: 9, day: 15 };
const leapAnchor = { year: 2020, month: 2, day: 29 };

describe('useModeBLazyWeather', () => {
  it('не раскрывает год без даты или когда год невозможен', () => {
    const empty = renderHook(() =>
      useModeBLazyWeather({
        lat: 1,
        lon: 2,
        anchorDate: null,
      }),
    );

    expect(empty.result.current.years).toEqual([]);
    expect(empty.result.current.isYearExpandable(2020)).toBe(false);

    const disabled = renderHook(() =>
      useModeBLazyWeather({
        lat: 1,
        lon: 2,
        anchorDate,
        enabled: false,
      }),
    );

    expect(disabled.result.current.isYearExpandable(2020)).toBe(false);

    const february = renderHook(() =>
      useModeBLazyWeather({
        lat: 1,
        lon: 2,
        anchorDate: leapAnchor,
      }),
    );

    expect(february.result.current.isYearExpandable(2019)).toBe(false);
    expect(february.result.current.isYearExpandable(2020)).toBe(true);

    act(() => {
      february.result.current.loadYear(2019);
    });

    expect(fetchModeBYear).not.toHaveBeenCalled();
  });

  it('загружает год, пропускает повтор и перезагружает', async () => {
    let resolveYear: (value: { year: number; days: [] }) => void = () => {};

    vi.mocked(fetchModeBYear).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveYear = resolve;
        }),
    );

    const { result, rerender } = renderHook(
      (props: { lat: number }) =>
        useModeBLazyWeather({
          lat: props.lat,
          lon: 2,
          anchorDate,
        }),
      { initialProps: { lat: 1 } },
    );

    expect(result.current.years).toHaveLength(21);

    act(() => {
      result.current.setExpandedYears([2020]);
      result.current.loadYear(2020);
    });

    act(() => {
      result.current.loadYear(2020);
    });

    expect(fetchModeBYear).toHaveBeenCalledTimes(1);
    expect(result.current.loadingYears.has(2020)).toBe(true);

    await act(async () => {
      resolveYear({ year: 2020, days: [] });
    });

    expect(result.current.windowsByYear.get(2020)?.year).toBe(2020);
    expect(result.current.loadingYears.has(2020)).toBe(false);

    act(() => {
      result.current.loadYear(2020);
    });

    expect(fetchModeBYear).toHaveBeenCalledTimes(1);

    vi.mocked(fetchModeBYear).mockResolvedValueOnce({
      year: 2020,
      days: [],
    });

    act(() => {
      result.current.reloadYear(2020);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchModeBYear).toHaveBeenCalledTimes(2);

    rerender({ lat: 3 });

    expect(result.current.windowsByYear.size).toBe(0);
    expect(result.current.expandedYears).toEqual([]);
  });

  it('запоминает ошибку года', async () => {
    vi.mocked(fetchModeBYear).mockRejectedValueOnce(new Error('сеть'));

    const failed = renderHook(() =>
      useModeBLazyWeather({ lat: 1, lon: 2, anchorDate }),
    );

    act(() => {
      failed.result.current.loadYear(2020);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(failed.result.current.errorYears.get(2020)?.message).toBe('сеть');

    vi.mocked(fetchModeBYear).mockRejectedValueOnce('сбой');

    const other = renderHook(() =>
      useModeBLazyWeather({ lat: 4, lon: 5, anchorDate }),
    );

    act(() => {
      other.result.current.loadYear(2018);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(other.result.current.errorYears.get(2018)?.message).toBe(
      'Не удалось загрузить данные года',
    );
  });

  it('не запрашивает год без координат', () => {
    const { result } = renderHook(() =>
      useModeBLazyWeather({ lat: null, lon: null, anchorDate }),
    );

    act(() => {
      result.current.loadYear(2020);
    });

    expect(fetchModeBYear).not.toHaveBeenCalled();
  });
});
