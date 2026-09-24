import { DatePicker, message } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';

import type { AnchorDate } from '@types';

import type { AnchorDatePickerProps } from './AnchorDatePicker.types';

const DATE_FORMAT = 'DD.MM.YYYY';

const toPickerDate = (anchor: AnchorDate): Dayjs => {
  return dayjs(new Date(anchor.year, anchor.month - 1, anchor.day));
};

const endOfToday = (): Dayjs => {
  const now = new Date();

  return dayjs(
    new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
  );
};

const isAfterToday = (date: Dayjs): boolean => {
  const now = new Date();
  const selected = new Date(date.year(), date.month(), date.date());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return selected.getTime() > today.getTime();
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

    if (isAfterToday(date)) {
      message.warning('Нельзя выбрать дату позже сегодняшней');

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
      maxDate={endOfToday()}
      onChange={handleChange}
      picker="date"
      placeholder="Выберите дату"
      value={toPickerDate(value)}
    />
  );
};
