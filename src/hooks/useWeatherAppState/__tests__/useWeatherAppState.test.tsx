import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

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
    const { result } = renderHook(() => useWeatherAppState(), { wrapper });

    expect(result.current.yearRange).toHaveLength(21);
    expect(result.current.yearRangeLabel).toContain('–');

    act(() => {
      result.current.setAnchorDate({ year: 2020, month: 9, day: 15 });
    });

    expect(result.current.anchorDate).toEqual({
      year: 2020,
      month: 9,
      day: 15,
    });
    expect(result.current.yearRangeLabel).toBe('2010–2030');
  });
});
