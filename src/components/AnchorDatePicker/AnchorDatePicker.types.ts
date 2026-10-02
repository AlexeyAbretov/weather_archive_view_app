import type { AnchorDate } from '@types';

export type AnchorDatePickerProps = {
  value: AnchorDate;
  onChange: (date: AnchorDate) => void;
  disabled?: boolean;
};
