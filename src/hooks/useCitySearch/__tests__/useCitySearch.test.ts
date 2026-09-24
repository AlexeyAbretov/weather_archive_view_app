import { beforeEach, describe, expect, it, vi } from 'vitest';

import { searchCities } from '@api';
import { act, renderHook } from '@testing-library/react';

import { useCitySearch } from '../useCitySearch';

vi.mock('@api', async () => {
  const actual = await vi.importActual<typeof import('@api')>('@api');

  return {
    ...actual,
    searchCities: vi.fn(),
  };
});

describe('useCitySearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(searchCities).mockReset();
  });

  it('сбрасывает короткий запрос', () => {
    const { result } = renderHook(() => useCitySearch());

    expect(result.current.status).toBe('idle');
    expect(result.current.results).toEqual([]);
  });

  it('показывает города и пустой результат', async () => {
    vi.mocked(searchCities).mockResolvedValueOnce([
      {
        name: 'Москва',
        lat: 1,
        lon: 2,
        label: 'Москва',
      },
    ]);

    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.setQuery('Мо');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(result.current.status).toBe('idle');
    expect(result.current.results).toHaveLength(1);

    vi.mocked(searchCities).mockResolvedValueOnce([]);

    act(() => {
      result.current.setQuery('Ыы');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(result.current.status).toBe('empty');
  });

  it('показывает ошибку Error и прочую', async () => {
    vi.mocked(searchCities).mockRejectedValueOnce(new Error('сеть'));

    const { result } = renderHook(() => useCitySearch());

    act(() => {
      result.current.setQuery('Мо');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(result.current.status).toBe('error');
    expect(result.current.errorMessage).toBe('сеть');

    vi.mocked(searchCities).mockRejectedValueOnce('сбой');

    act(() => {
      result.current.setQuery('Ту');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    expect(result.current.errorMessage).toBe(
      'Не удалось выполнить поиск городов',
    );
  });

  it('игнорирует ответ после отмены', async () => {
    let resolveSearch: (value: []) => void = () => {};

    let rejectSearch: (error: unknown) => void = () => {};

    vi.mocked(searchCities)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveSearch = resolve;
          }),
      )
      .mockImplementationOnce(
        () =>
          new Promise((_resolve, reject) => {
            rejectSearch = reject;
          }),
      );

    const first = renderHook(() => useCitySearch());

    act(() => {
      first.result.current.setQuery('Мо');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    first.unmount();
    resolveSearch([]);

    const second = renderHook(() => useCitySearch());

    act(() => {
      second.result.current.setQuery('Ту');
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    second.unmount();

    await act(async () => {
      rejectSearch(new Error('abort'));
    });

    expect(searchCities).toHaveBeenCalledTimes(2);
  });
});
