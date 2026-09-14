type QueueTask<T> = {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

export class RequestQueue {
  private readonly maxConcurrent: number;
  private activeCount = 0;
  private readonly queue: QueueTask<unknown>[] = [];

  constructor(maxConcurrent = 4) {
    this.maxConcurrent = maxConcurrent;
  }

  enqueue<T>(run: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ run, resolve: resolve as (value: unknown) => void, reject });
      this.processNext();
    });
  }

  private processNext(): void {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    if (!task) {
      return;
    }

    this.activeCount += 1;

    task
      .run()
      .then(task.resolve)
      .catch(task.reject)
      .finally(() => {
        this.activeCount -= 1;
        this.processNext();
      });
  }
}

export const archiveRequestQueue = new RequestQueue(4);
