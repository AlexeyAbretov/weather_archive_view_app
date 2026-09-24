import type { YearWeatherRow } from '@domain';
import type { SelectedLocation } from '@types';

export type ModeAViewProps = {
  data: YearWeatherRow[];
  error: Error | null;
  loading: boolean;
  location: SelectedLocation | null;
  onReload: () => void;
};
