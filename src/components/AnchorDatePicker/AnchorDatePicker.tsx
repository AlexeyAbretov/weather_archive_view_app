import 'dayjs/locale/ru';

import { DatePicker, message } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import dayjs, { type Dayjs } from 'dayjs';

import type { AnchorDate } from '@types';

import type { AnchorDatePickerProps } from './AnchorDatePicker.types';

dayjs.locale('ru');

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
      locale={ruRU.DatePicker}
      onChange={handleChange}
      picker="date"
      placeholder="Выберите дату"
      value={toPickerDate(value)}
    />
  );
};
