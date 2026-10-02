export type ViewMode = 'A' | 'B';

export type ModeSwitcherProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};
