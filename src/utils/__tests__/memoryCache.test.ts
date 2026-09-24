import { afterEach, describe, expect, it, vi } from 'vitest';

import { DEFAULT_CACHE_TTL_MS, MemoryCache } from '../memoryCache';

describe('MemoryCache', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('хранит значение до истечения срока', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const cache = new MemoryCache<number>(50);

    expect(cache.get('missing')).toBeUndefined();
    expect(cache.has('missing')).toBe(false);

    cache.set('a', 1);

    expect(cache.get('a')).toBe(1);
    expect(cache.has('a')).toBe(true);

    vi.spyOn(Date, 'now').mockReturnValue(1_051);

    expect(cache.get('a')).toBeUndefined();
    expect(cache.has('a')).toBe(false);
  });

  it('очищает хранилище и использует срок по умолчанию', () => {
    vi.spyOn(Date, 'now').mockReturnValue(0);
    const cache = new MemoryCache<string>();

    cache.set('b', 'value');
    cache.clear();

    expect(cache.get('b')).toBeUndefined();
    expect(DEFAULT_CACHE_TTL_MS).toBe(45 * 60 * 1000);
  });
});
