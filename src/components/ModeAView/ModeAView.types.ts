import type { YearWeatherRow } from '@domain';
import type { SelectedLocation } from '@types';

export type YearTableLayout = 'rows' | 'columns';

export type ModeAViewProps = {
  anchorYear: number;
  data: YearWeatherRow[];
  error: Error | null;
  loading: boolean;
  location: SelectedLocation | null;
  onReload: () => void;
};
