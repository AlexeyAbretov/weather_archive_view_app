import { Empty } from 'antd';

import type { ModeBViewProps } from './ModeBView.types';

import { YearWindowTable } from '../YearWindowTable';

export const ModeBView = ({
  errorYears,
  expandedYears,
  isYearExpandable,
  loadingYears,
  location,
  onExpandYear,
  onExpandedYearsChange,
  onRetryYear,
  windowsByYear,
  years,
}: ModeBViewProps) => {
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
      onExpandYear={onExpandYear}
      onExpandedYearsChange={onExpandedYearsChange}
      onRetryYear={onRetryYear}
      windowsByYear={windowsByYear}
      years={years}
    />
  );
};
