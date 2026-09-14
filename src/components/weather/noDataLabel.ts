import type { NoDataReason } from '../../domain/weather/weatherDayRecord.ts';

const NO_DATA_LABELS: Record<NoDataReason, string> = {
  future: 'нет данных',
  feb29: 'нет данных',
  archive_lag: 'нет данных',
  api_error: 'нет данных',
  missing: '—',
};

export function getNoDataLabel(reason?: NoDataReason): string {
  if (!reason) {
    return '—';
  }

  return NO_DATA_LABELS[reason];
}
