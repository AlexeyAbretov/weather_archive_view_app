import { createElement, type ReactNode, StrictMode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchModeBYear } from '@services';
import { act, renderHook } from '@testing-library/react';
import { readExpandedYears, saveExpandedYears } from '@utils';

import { useModeBLazyWeather } from '../useModeBLazyWeather';

vi.mock('@services', () => ({
  fetchModeBYear: vi.fn(),
}));

const anchorDate = { year: 2020, month: 9, day: 15 };
const leapAnchor = { year: 2020, month: 2, day: 29 };

describe('useModeBLazyWeather', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(fetchModeBYear).mockReset();
    vi.mocked(fetchModeBYear).mockResolvedValue({ year: 2020, days: [] });
  });

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

    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 24));

    const { result, rerender } = renderHook(
      (props: { lat: number }) =>
        useModeBLazyWeather({
          lat: props.lat,
          lon: 2,
          anchorDate,
        }),
      { initialProps: { lat: 1 } },
    );

    expect(result.current.years).toEqual(
      Array.from({ length: 17 }, (_, index) => 2010 + index),
    );

    vi.useRealTimers();

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

  it('сохраняет только возможные годы и восстанавливает их', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 24));

    const first = renderHook(() =>
      useModeBLazyWeather({ lat: 1, lon: 2, anchorDate: leapAnchor }),
    );

    act(() => {
      first.result.current.setExpandedYears([2019, 2020, 2020, 1900]);
    });

    expect(first.result.current.expandedYears).toEqual([2020]);
    expect(readExpandedYears(1, 2, leapAnchor)).toEqual([2020]);

    first.unmount();

    saveExpandedYears(1, 2, anchorDate, [2018, 2020, 1900]);

    const restored = renderHook(() =>
      useModeBLazyWeather({ lat: 1, lon: 2, anchorDate }),
    );

    expect(restored.result.current.expandedYears).toEqual([2018, 2020]);
    expect(fetchModeBYear).toHaveBeenCalledTimes(2);

    vi.useRealTimers();

    await act(async () => {
      await Promise.resolve();
    });
  });

  it('возвращает раскрытые годы при возврате к той же дате', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 24));

    const { result, rerender } = renderHook(
      (props: { year: number }) =>
        useModeBLazyWeather({
          lat: 1,
          lon: 2,
          anchorDate: { year: props.year, month: 9, day: 15 },
        }),
      { initialProps: { year: 2020 } },
    );

    act(() => {
      result.current.setExpandedYears([2020]);
    });

    rerender({ year: 2021 });

    expect(result.current.expandedYears).toEqual([]);

    rerender({ year: 2020 });

    expect(result.current.expandedYears).toEqual([2020]);

    vi.useRealTimers();
  });

  it('не сбрасывает раскрытые годы при повторном эффекте', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 24));
    saveExpandedYears(1, 2, anchorDate, [2020]);

    const { result } = renderHook(
      () => useModeBLazyWeather({ lat: 1, lon: 2, anchorDate }),
      {
        wrapper: ({ children }: { children: ReactNode }) =>
          createElement(StrictMode, null, children),
      },
    );

    expect(result.current.expandedYears).toEqual([2020]);

    vi.useRealTimers();
  });
});
