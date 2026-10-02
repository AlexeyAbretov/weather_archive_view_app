import { message } from 'antd';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { reverseGeocode, searchCities } from '@api';
import { act, renderHook } from '@testing-library/react';

import { useGeolocation } from '../useGeolocation';

vi.mock('@api', () => ({
  reverseGeocode: vi.fn(),
  searchCities: vi.fn(),
}));

const position = {
  coords: { latitude: 55.75, longitude: 37.62 },
};

describe('useGeolocation', () => {
  beforeEach(() => {
    vi.mocked(reverseGeocode).mockReset();
    vi.mocked(searchCities).mockReset();
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

  it('подставляет ближайший город из поиска', async () => {
    const getCurrentPosition = vi.fn();
    const moscow = {
      name: 'Москва',
      label: 'Москва, Москва, Россия',
      lat: 55.7522,
      lon: 37.6156,
    };
    const namesake = {
      name: 'Москва',
      label: 'Москва, Айдахо, США',
      lat: 46.7324,
      lon: -117.0002,
    };

    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });
    getCurrentPosition.mockImplementation(
      (success: (value: unknown) => void) => {
        success(position);
      },
    );
    vi.mocked(reverseGeocode).mockResolvedValue(['Москва']);
    vi.mocked(searchCities).mockResolvedValueOnce([namesake, moscow]);

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toEqual(moscow);
    });

    expect(searchCities).toHaveBeenCalledWith('Москва');
    expect(message.info).not.toHaveBeenCalled();

    vi.mocked(searchCities).mockResolvedValueOnce([]);

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toBeNull();
    });

    vi.mocked(reverseGeocode).mockResolvedValueOnce([]);

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toBeNull();
    });

    vi.mocked(reverseGeocode).mockRejectedValueOnce(new Error('сеть'));

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toBeNull();
    });

    expect(message.info).toHaveBeenCalledTimes(3);
  });

  it('берёт следующий пункт, если первый слишком далеко', async () => {
    const getCurrentPosition = vi.fn();
    const farHamlet = {
      name: 'Толстяково',
      label: 'Толстяково, другая область, Россия',
      lat: 43.1,
      lon: 40.2,
    };
    const city = {
      name: 'Солнечногорск',
      label: 'Солнечногорск, Московская область, Россия',
      lat: 56.18,
      lon: 36.98,
    };

    vi.stubGlobal('navigator', { geolocation: { getCurrentPosition } });
    getCurrentPosition.mockImplementation(
      (success: (value: unknown) => void) => {
        success(position);
      },
    );
    vi.mocked(reverseGeocode).mockResolvedValueOnce([
      'Толстяково',
      'Солнечногорск',
    ]);
    vi.mocked(searchCities)
      .mockResolvedValueOnce([farHamlet])
      .mockResolvedValueOnce([city]);

    const { result } = renderHook(() => useGeolocation());

    await act(async () => {
      await expect(result.current.detectLocation()).resolves.toEqual(city);
    });

    expect(searchCities).toHaveBeenNthCalledWith(1, 'Толстяково');
    expect(searchCities).toHaveBeenNthCalledWith(2, 'Солнечногорск');
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
