import { Segmented } from 'antd';

export type ViewMode = 'A' | 'B';

type ModeSwitcherProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

const MODE_OPTIONS = [
  { label: 'Режим A — по годам', value: 'A' as const },
  { label: 'Режим B — неделя', value: 'B' as const },
];

export function ModeSwitcher({ value, onChange }: ModeSwitcherProps) {
  return (
    <Segmented
      options={MODE_OPTIONS}
      value={value}
      onChange={(nextValue) => {
        onChange(nextValue as ViewMode);
      }}
    />
  );
}
