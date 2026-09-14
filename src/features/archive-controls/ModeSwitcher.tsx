import { Segmented } from 'antd';
import { useAppFilters } from '../../app/context/AppFiltersContext';
import type { ViewMode } from '../../app/url/queryParams';

export function ModeSwitcher() {
  const { mode, setMode } = useAppFilters();

  return (
    <Segmented<ViewMode>
      value={mode}
      onChange={setMode}
      options={[
        { label: 'По годам (A)', value: 'a' },
        { label: 'По неделям (B)', value: 'b' },
      ]}
    />
  );
}
