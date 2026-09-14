import { DatePicker, message } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import type { Dayjs } from 'dayjs';

import { toDayjs } from '../../lib/date/anchorDate.ts';
import type { AnchorDate } from '../../types/anchorDate.ts';

const DATE_FORMAT = 'DD.MM.YYYY';

type AnchorDatePickerProps = {
  value: AnchorDate;
  onChange: (date: Dayjs | null) => void;
  disabled?: boolean;
};

export function AnchorDatePicker({
  value,
  onChange,
  disabled,
}: AnchorDatePickerProps) {
  function handleChange(date: Dayjs | null) {
    if (date && !date.isValid()) {
      message.warning('Некорректная дата');

      return;
    }

    onChange(date);
  }

  return (
    <DatePicker
      allowClear={false}
      disabled={disabled}
      format={DATE_FORMAT}
      locale={ruRU.DatePicker}
      onChange={handleChange}
      picker="date"
      placeholder="Выберите дату"
      value={toDayjs(value)}
    />
  );
}
