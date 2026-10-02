import dayjs, { type Dayjs } from 'dayjs';
import { describe, expect, it, vi } from 'vitest';

import { render } from '@testing-library/react';

import { AnchorDatePicker } from '../AnchorDatePicker';

type PickerProps = {
  disabled?: boolean;
  maxDate?: Dayjs;
  onChange?: (date: Dayjs | null) => void;
};

let pickerProps: PickerProps | undefined;

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');

  return {
    ...actual,
    DatePicker: (props: PickerProps) => {
      pickerProps = props;

      return <input aria-label="Дата" disabled={props.disabled} />;
    },
  };
});

describe('AnchorDatePicker change', () => {
  it('предупреждает о пустой дате и отдаёт год, месяц и день', () => {
    const onChange = vi.fn();

    render(
      <AnchorDatePicker
        onChange={onChange}
        value={{ year: 2020, month: 9, day: 15 }}
      />,
    );

    pickerProps?.onChange?.(null);

    expect(onChange).not.toHaveBeenCalled();

    pickerProps?.onChange?.(dayjs('invalid'));

    expect(onChange).not.toHaveBeenCalled();

    pickerProps?.onChange?.(dayjs('2020-09-20'));

    expect(onChange).toHaveBeenCalledWith({
      year: 2020,
      month: 9,
      day: 20,
    });
  });

  it('не принимает дату позже сегодняшней', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2020, 8, 15, 12));

    const onChange = vi.fn();

    render(
      <AnchorDatePicker
        onChange={onChange}
        value={{ year: 2020, month: 9, day: 15 }}
      />,
    );

    expect(pickerProps?.maxDate?.isSame(dayjs('2020-09-15'), 'day')).toBe(true);

    pickerProps?.onChange?.(dayjs('2020-09-16'));

    expect(onChange).not.toHaveBeenCalled();

    pickerProps?.onChange?.(dayjs('2020-09-15'));

    expect(onChange).toHaveBeenCalledWith({
      year: 2020,
      month: 9,
      day: 15,
    });

    vi.useRealTimers();
  });
});
