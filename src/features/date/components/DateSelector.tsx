import { DatePicker } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useAppFilters } from '../../../app/context/AppFiltersContext';

const MIN_DATE = dayjs('1940-01-01');

export function DateSelector() {
  const { date, setDate } = useAppFilters();

  const disabledDate = (current: Dayjs) => {
    return current.isAfter(dayjs(), 'day') || current.isBefore(MIN_DATE, 'day');
  };

  return (
    <DatePicker
      value={dayjs(date)}
      onChange={(value) => {
        if (value) {
          setDate(value.format('YYYY-MM-DD'));
        }
      }}
      disabledDate={disabledDate}
      format="DD.MM.YYYY"
      allowClear={false}
      placeholder="Выберите дату"
    />
  );
}
