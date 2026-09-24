import { DatePicker, message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';

import type { AnchorDate } from '@types';

import type { AnchorDatePickerProps } from './AnchorDatePicker.types';

const DATE_FORMAT = 'DD.MM.YYYY';

const toPickerDate = (anchor: AnchorDate): Dayjs => {
  return dayjs(new Date(anchor.year, anchor.month - 1, anchor.day));
};

export const AnchorDatePicker = ({
  value,
  onChange,
  disabled,
}: AnchorDatePickerProps) => {
  const handleChange = (date: Dayjs | null) => {
    if (!date?.isValid()) {
      message.warning('Некорректная дата');

      return;
    }

    onChange({
      year: date.year(),
      month: date.month() + 1,
      day: date.date(),
    });
  };

  return (
    <DatePicker
      allowClear={false}
      disabled={disabled}
      format={DATE_FORMAT}
      onChange={handleChange}
      picker="date"
      placeholder="Выберите дату"
      value={toPickerDate(value)}
    />
  );
};
