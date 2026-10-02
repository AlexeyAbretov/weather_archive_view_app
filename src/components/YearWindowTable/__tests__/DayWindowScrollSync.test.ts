import { describe, expect, it } from 'vitest';

import { createDayWindowScrollSync } from '../DayWindowScrollSync';

type FakeScroller = {
  scrollLeft: number;
  max: number;
  onScroll: () => void;
};

const createFakeScroller = (max = Number.POSITIVE_INFINITY): FakeScroller => {
  let left = 0;
  const node: FakeScroller = {
    max,
    onScroll: () => {},
    get scrollLeft() {
      return left;
    },
    set scrollLeft(value: number) {
      const next = Math.min(Math.max(value, 0), node.max);

      if (next === left) {
        return;
      }

      left = next;
      node.onScroll();
    },
  };

  return node;
};

describe('createDayWindowScrollSync', () => {
  it('сдвигает остальные таблицы и новую ставит на ту же позицию', () => {
    const sync = createDayWindowScrollSync();
    const first = createFakeScroller();
    const second = createFakeScroller();

    sync.register(first);
    sync.register(second);

    first.onScroll = () => {
      sync.syncFrom(first);
    };

    second.onScroll = () => {
      sync.syncFrom(second);
    };

    first.scrollLeft = 180;

    expect(second.scrollLeft).toBe(180);
    expect(sync.getLeft()).toBe(180);

    const third = createFakeScroller();

    third.onScroll = () => {
      sync.syncFrom(third);
    };

    sync.register(third);

    expect(third.scrollLeft).toBe(180);
  });

  it('не укорачивает позицию из-за более узкой таблицы', () => {
    const sync = createDayWindowScrollSync();
    const wide = createFakeScroller();
    const narrow = createFakeScroller(50);

    sync.register(wide);
    sync.register(narrow);

    wide.onScroll = () => {
      sync.syncFrom(wide);
    };

    narrow.onScroll = () => {
      sync.syncFrom(narrow);
    };

    wide.scrollLeft = 120;

    expect(narrow.scrollLeft).toBe(50);
    expect(wide.scrollLeft).toBe(120);
    expect(sync.getLeft()).toBe(120);
  });

  it('после закрытия таблицы больше её не двигает', () => {
    const sync = createDayWindowScrollSync();
    const first = createFakeScroller();
    const second = createFakeScroller();
    const unregister = sync.register(second);

    sync.register(first);

    first.onScroll = () => {
      sync.syncFrom(first);
    };

    unregister();
    first.scrollLeft = 70;

    expect(second.scrollLeft).toBe(0);
  });
});
