import { describe, expect, it, vi } from 'vitest';

import { fetchModeB } from '@services';
import { act, renderHook } from '@testing-library/react';

import { useModeBWeather } from '../useModeBWeather';

vi.mock('@services', () => ({
  fetchModeB: vi.fn(),
}));

const anchorDate = { year: 2020, month: 9, day: 15 };

describe('useModeBWeather', () => {
  it('не грузит данные без координат', () => {
    const { result } = renderHook(() =>
      useModeBWeather({
        lat: null,
        lon: 2,
        anchorDate,
        enabled: true,
      }),
    );

    expect(result.current.data).toEqual([]);
    expect(fetchModeB).not.toHaveBeenCalled();
  });

  it('загружает окна и обрабатывает ошибки', async () => {
    vi.mocked(fetchModeB).mockResolvedValueOnce([{ year: 2020, days: [] }]);

    const loaded = renderHook(() =>
      useModeBWeather({ lat: 1, lon: 2, anchorDate }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(loaded.result.current.data).toHaveLength(1);

    act(() => {
      loaded.result.current.reload();
    });

    await act(async () => {
      await Promise.resolve();
    });

    vi.mocked(fetchModeB).mockRejectedValueOnce(new Error('сеть'));

    const failed = renderHook(() =>
      useModeBWeather({ lat: 3, lon: 4, anchorDate }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(failed.result.current.error?.message).toBe('сеть');

    vi.mocked(fetchModeB).mockRejectedValueOnce('сбой');

    const other = renderHook(() =>
      useModeBWeather({ lat: 5, lon: 6, anchorDate }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(other.result.current.error?.message).toBe(
      'Не удалось загрузить архив погоды',
    );

    let resolveWindows: (value: []) => void = () => {};

    vi.mocked(fetchModeB).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveWindows = resolve;
        }),
    );

    const pending = renderHook(() =>
      useModeBWeather({ lat: 7, lon: 8, anchorDate }),
    );

    pending.unmount();
    resolveWindows([]);
  });
});
