import { Empty } from 'antd';
import { useMemo } from 'react';

import { YearWindowTable } from './YearWindowTable.tsx';

import { useModeBLazyWeather } from '../../../hooks/useModeBLazyWeather.ts';
import { toDayjs } from '../../../lib/date/anchorDate.ts';
import type { AnchorDate } from '../../../types/anchorDate.ts';
import type { SelectedLocation } from '../../location/types.ts';

type ModeBViewProps = {
  location: SelectedLocation | null;
  anchorDate: AnchorDate;
};

export function ModeBView({ location, anchorDate }: ModeBViewProps) {
  const anchorDayjs = useMemo(() => toDayjs(anchorDate), [anchorDate]);

  const {
    years,
    windowsByYear,
    loadingYears,
    errorYears,
    expandedYears,
    setExpandedYears,
    loadYear,
    reloadYear,
    isYearExpandable,
  } = useModeBLazyWeather({
    lat: location?.lat ?? null,
    lon: location?.lon ?? null,
    anchorDate: anchorDayjs,
    enabled: location != null,
  });

  if (!location) {
    return (
      <Empty
        description="Выберите город и дату для просмотра архива"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <YearWindowTable
      errorYears={errorYears}
      expandedYears={expandedYears}
      isYearExpandable={isYearExpandable}
      loadingYears={loadingYears}
      onExpandYear={loadYear}
      onExpandedYearsChange={setExpandedYears}
      onRetryYear={reloadYear}
      windowsByYear={windowsByYear}
      years={years}
    />
  );
}
