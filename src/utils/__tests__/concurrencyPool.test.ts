import { describe, expect, it } from 'vitest';

import {
  DEFAULT_CONCURRENCY_LIMIT,
  runWithConcurrencyLimit,
} from '../concurrencyPool';

describe('runWithConcurrencyLimit', () => {
  it('возвращает пустой список без задач', async () => {
    await expect(runWithConcurrencyLimit([])).resolves.toEqual([]);
  });

  it('сохраняет порядок и ограничивает параллельность', async () => {
    let active = 0;
    let maxActive = 0;

    const tasks = [1, 2, 3, 4, 5].map((value) => async () => {
      active += 1;
      maxActive = Math.max(maxActive, active);
      await Promise.resolve();
      active -= 1;

      return value;
    });

    await expect(runWithConcurrencyLimit(tasks, 2)).resolves.toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(maxActive).toBeLessThanOrEqual(2);
    expect(DEFAULT_CONCURRENCY_LIMIT).toBe(4);
  });

  it('использует лимит по умолчанию', async () => {
    const tasks = [1, 2].map((value) => async () => value);

    await expect(runWithConcurrencyLimit(tasks)).resolves.toEqual([1, 2]);
  });
});
