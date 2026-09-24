import { describe, expect, it } from 'vitest';

import { getNoDataLabel } from '../noDataLabel';

describe('getNoDataLabel', () => {
  it('возвращает подпись причины или прочерк', () => {
    expect(getNoDataLabel()).toBe('—');
    expect(getNoDataLabel('future')).toBe('нет данных');
    expect(getNoDataLabel('feb29')).toBe('нет данных');
    expect(getNoDataLabel('archive_lag')).toBe('нет данных');
    expect(getNoDataLabel('api_error')).toBe('нет данных');
    expect(getNoDataLabel('missing')).toBe('—');
  });
});
