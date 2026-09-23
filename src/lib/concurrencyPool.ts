export const DEFAULT_CONCURRENCY_LIMIT = 4;

export const runWithConcurrencyLimit = async <T>(
  tasks: (() => Promise<T>)[],
  limit = DEFAULT_CONCURRENCY_LIMIT,
): Promise<T[]> => {
  if (tasks.length === 0) {
    return [];
  }

  const results: T[] = new Array(tasks.length);
  let nextIndex = 0;

  const worker = async (): Promise<void> => {
    while (nextIndex < tasks.length) {
      const currentIndex = nextIndex;

      nextIndex += 1;
      results[currentIndex] = await tasks[currentIndex]();
    }
  };

  const workerCount = Math.min(limit, tasks.length);

  await Promise.all(Array.from({ length: workerCount }, () => worker()));

  return results;
};
