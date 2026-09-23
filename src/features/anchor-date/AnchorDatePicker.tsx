import { toDayjs } from '@lib/date/anchorDate.ts';
import { DatePicker, message } from 'antd';
import ruRU from 'antd/es/locale/ru_RU';
import type { Dayjs } from 'dayjs';

import type { AnchorDate } from '@types';

const DATE_FORMAT = 'DD.MM.YYYY';

type AnchorDatePickerProps = {
  value: AnchorDate;
  onChange: (date: Dayjs | null) => void;
  disabled?: boolean;
};

export const AnchorDatePicker = ({
  value,
  onChange,
  disabled,
}: AnchorDatePickerProps) => {
  const handleChange = (date: Dayjs | null) => {
    if (date && !date.isValid()) {
      message.warning('Некорректная дата');

      return;
    }

    onChange(date);
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
      value={toDayjs(value)}
    />
  );
};
