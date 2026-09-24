import { Empty } from 'antd';

import { useModeBLazyWeather } from '@hooks';

import type { ModeBViewProps } from './ModeBView.types';

import { YearWindowTable } from '../YearWindowTable';

export const ModeBView = ({ location, anchorDate }: ModeBViewProps) => {
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
    anchorDate,
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
};
