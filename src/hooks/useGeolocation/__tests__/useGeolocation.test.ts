import { message } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { reverseGeocode } from '@api';
import { act, renderHook } from '@testing-library/react';

import { useGeolocation } from '../useGeolocation';

vi.mock('@api', () => ({
  reverseGeocode: vi.fn(),
}));

const position = {
  coords: { latitude: 55.75, longitude: 37.62 },
};

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.mocked(reverseGeocode).mockReset();
    vi.spyOn(message, 'info').mockImplementation(() => {
      return {} as ReturnType<typeof message.info>;
    });
  });

  it('сообщает, если геолокация недоступна', async () => {
    vi.stubGlobal('navigator', {});

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toBeNull();
    });

    expect(message.info).toHaveBeenCalled();
    expect(result.current.isLocating).toBe(false);
  });

  it('возвращает город или запасное имя по координатам', async () => {
    const getCurrentPosition = vi.fn();

    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });
    getCurrentPosition.mockImplementation(
      (success: (value: unknown) => void) => {
        success(position);
      },
    );
    vi.mocked(reverseGeocode).mockResolvedValueOnce('Москва');

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toEqual({
        name: 'Москва',
        lat: 55.75,
        lon: 37.62,
      });
    });

    vi.mocked(reverseGeocode).mockResolvedValueOnce(null);

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toEqual({
        name: 'Моё местоположение (55.75, 37.62)',
        lat: 55.75,
        lon: 37.62,
      });
    });

    vi.mocked(reverseGeocode).mockRejectedValueOnce(new Error('сеть'));

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toMatchObject({
        name: 'Моё местоположение (55.75, 37.62)',
      });
    });
  });

  it('различает отказ и прочий сбой геолокации', async () => {
    const getCurrentPosition = vi.fn();

    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });

    const denied = new GeolocationPositionError();

    Object.assign(denied, { code: 1 });

    getCurrentPosition.mockImplementationOnce(
      (_success: unknown, fail: (error: unknown) => void) => {
        fail(denied);
      },
    );

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toBeNull();
    });

    getCurrentPosition.mockImplementationOnce(
      (_success: unknown, fail: (error: unknown) => void) => {
        fail(new Error('timeout'));
      },
    );

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toBeNull();
    });

    expect(message.info).toHaveBeenCalledTimes(2);
  });
});
