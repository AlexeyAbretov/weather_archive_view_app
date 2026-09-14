import { Segmented } from 'antd';

export type ViewMode = 'A' | 'B';

type ModeSwitcherProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

const MODE_OPTIONS = [
  { label: 'По годам (A)', value: 'A' as const },
  { label: 'По неделям (B)', value: 'B' as const },
];

export function ModeSwitcher({ value, onChange }: ModeSwitcherProps) {
  return (
    <div className="mode-switcher">
      <Segmented
        block
        options={MODE_OPTIONS}
        value={value}
        onChange={(nextValue) => {
          onChange(nextValue as ViewMode);
        }}
      />
    </div>
  );
}
