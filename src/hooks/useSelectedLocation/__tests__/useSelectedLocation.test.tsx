import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { LocationProvider } from '@providers';
import { act, renderHook } from '@testing-library/react';

import { useSelectedLocation } from '../useSelectedLocation';

const wrapper = ({ children }: { children: ReactNode }) => {
  return <LocationProvider>{children}</LocationProvider>;
};

describe('useSelectedLocation', () => {
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
});
