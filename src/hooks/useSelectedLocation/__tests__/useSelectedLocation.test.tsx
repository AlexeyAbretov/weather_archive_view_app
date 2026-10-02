import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';

import { LocationProvider } from '@providers';
import { act, renderHook } from '@testing-library/react';

import { useSelectedLocation } from '../useSelectedLocation';

const wrapper = ({ children }: { children: ReactNode }) => {
  return <LocationProvider>{children}</LocationProvider>;
};

describe('useSelectedLocation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('требует провайдер', () => {
    expect(() => renderHook(() => useSelectedLocation())).toThrow(
      'useSelectedLocation должен использоваться в LocationProvider',
    );
  });

  it('читает и меняет выбранный город', () => {
    const { result } = renderHook(() => useSelectedLocation(), { wrapper });

    expect(result.current.location).toBeNull();

    act(() => {
      result.current.setLocation({
        name: 'Москва',
        label: 'Москва, Москва, Россия',
        lat: 1,
        lon: 2,
      });
    });

    expect(result.current.location?.name).toBe('Москва');

    act(() => {
      result.current.clearLocation();
    });

    expect(result.current.location).toBeNull();
  });

  it('восстанавливает город после обновления', () => {
    const first = renderHook(() => useSelectedLocation(), { wrapper });

    act(() => {
      first.result.current.setLocation({
        name: 'Казань',
        label: 'Казань, Татарстан, Россия',
        lat: 55.79,
        lon: 49.12,
      });
    });

    first.unmount();

    const second = renderHook(() => useSelectedLocation(), { wrapper });

    expect(second.result.current.location).toEqual({
      name: 'Казань',
      label: 'Казань, Татарстан, Россия',
      lat: 55.79,
      lon: 49.12,
    });
  });
});
