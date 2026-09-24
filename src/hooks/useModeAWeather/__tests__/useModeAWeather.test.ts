import { describe, expect, it, vi } from 'vitest';

import { fetchModeA } from '@services';
import { act, renderHook } from '@testing-library/react';

import { useModeAWeather } from '../useModeAWeather';

vi.mock('@services', () => ({
  fetchModeA: vi.fn(),
}));

const anchorDate = { year: 2020, month: 9, day: 15 };

describe('useModeAWeather', () => {
  it('не грузит данные без координат', () => {
    const { result } = renderHook(() =>
      useModeAWeather({
        lat: null,
        lon: null,
        anchorDate: null,
        enabled: false,
      }),
    );

    expect(result.current.data).toEqual([]);
    expect(fetchModeA).not.toHaveBeenCalled();
  });

  it('загружает строки и повторяет запрос', async () => {
    vi.mocked(fetchModeA).mockResolvedValue([
      {
        year: 2020,
        day: { date: '2020-09-15', year: 2020, hasData: false },
      },
    ]);

    const { result } = renderHook(() =>
      useModeAWeather({ lat: 1, lon: 2, anchorDate }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.data).toHaveLength(1);
    expect(result.current.loading).toBe(false);

    act(() => {
      result.current.reload();
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchModeA).toHaveBeenCalledTimes(2);
  });

  it('кладёт ошибку и отменяет незавершённый запрос', async () => {
    vi.mocked(fetchModeA).mockRejectedValueOnce(new Error('сеть'));

    const failed = renderHook(() =>
      useModeAWeather({ lat: 1, lon: 2, anchorDate }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(failed.result.current.error?.message).toBe('сеть');

    vi.mocked(fetchModeA).mockRejectedValueOnce('сбой');

    const other = renderHook(() =>
      useModeAWeather({ lat: 3, lon: 4, anchorDate }),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(other.result.current.error?.message).toBe(
      'Не удалось загрузить архив погоды',
    );

    let resolveRows: (value: []) => void = () => {};

    vi.mocked(fetchModeA).mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRows = resolve;
        }),
    );

    const pending = renderHook(() =>
      useModeAWeather({ lat: 5, lon: 6, anchorDate }),
    );

    pending.unmount();
    resolveRows([]);
  });
});
