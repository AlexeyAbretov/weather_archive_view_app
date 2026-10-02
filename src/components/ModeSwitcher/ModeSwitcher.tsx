import { Segmented } from 'antd';

import type { ModeSwitcherProps, ViewMode } from './ModeSwitcher.types';

const MODE_OPTIONS = [
  { label: 'По годам (A)', value: 'A' as const },
  { label: 'По неделям (B)', value: 'B' as const },
];

export const ModeSwitcher = ({ value, onChange }: ModeSwitcherProps) => {
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
};
