import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { WeatherAppProvider } from '@providers';
import { act, renderHook } from '@testing-library/react';

import { useWeatherAppState } from '../useWeatherAppState';

const wrapper = ({ children }: { children: ReactNode }) => {
  return <WeatherAppProvider>{children}</WeatherAppProvider>;
};

describe('useWeatherAppState', () => {
  it('требует провайдер', () => {
    expect(() => renderHook(() => useWeatherAppState())).toThrow(
      'useWeatherAppState должен вызываться внутри WeatherAppProvider',
    );
  });

  it('отдаёт якорную дату и диапазон лет', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 8, 24));

    const { result } = renderHook(() => useWeatherAppState(), { wrapper });

    expect(result.current.yearRange).toEqual(
      Array.from({ length: 11 }, (_, index) => 2016 + index),
    );
    expect(result.current.yearRangeLabel).toBe('2016–2026');

    act(() => {
      result.current.setAnchorDate({ year: 2020, month: 9, day: 15 });
    });

    expect(result.current.anchorDate).toEqual({
      year: 2020,
      month: 9,
      day: 15,
    });
    expect(result.current.yearRangeLabel).toBe('2010–2026');

    act(() => {
      result.current.setAnchorDate({ year: 2012, month: 3, day: 1 });
    });

    expect(result.current.yearRangeLabel).toBe('2002–2022');

    vi.useRealTimers();
  });
});
