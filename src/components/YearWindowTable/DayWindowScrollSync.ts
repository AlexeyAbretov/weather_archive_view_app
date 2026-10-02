export type DayWindowScroller = {
  scrollLeft: number;
};

export type DayWindowScrollSync = {
  getLeft: () => number;
  register: (node: DayWindowScroller) => () => void;
  syncFrom: (source: DayWindowScroller) => void;
  align: (node: DayWindowScroller) => void;
  releaseEcho: (node: DayWindowScroller) => void;
};

export const createDayWindowScrollSync = (): DayWindowScrollSync => {
  let left = 0;
  const nodes = new Set<DayWindowScroller>();
  const echoing = new Set<DayWindowScroller>();

  const write = (node: DayWindowScroller, next: number) => {
    if (node.scrollLeft === next) {
      return;
    }

    echoing.add(node);
    node.scrollLeft = next;
  };

  return {
    getLeft: () => left,

    register: (node) => {
      nodes.add(node);
      write(node, left);

      return () => {
        nodes.delete(node);
        echoing.delete(node);
      };
    },

    align: (node) => {
      write(node, left);
    },

    releaseEcho: (node) => {
      echoing.delete(node);
    },

    syncFrom: (source) => {
      if (echoing.has(source)) {
        echoing.delete(source);

        return;
      }

      const next = source.scrollLeft;

      if (next === left) {
        return;
      }

      left = next;

      nodes.forEach((node) => {
        if (node !== source) {
          write(node, next);
        }
      });
    },
  };
};
