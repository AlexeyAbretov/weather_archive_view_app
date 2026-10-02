import { describe, expect, it } from 'vitest';

import { noDataDay, weatherDay } from '../../../../test/fixtures';
import { renderWithLocale } from '../../../../test/render';
import { WindCell } from '../WindCell';

describe('WindCell', () => {
  it('показывает стрелку, скорость и отсутствие данных', () => {
    const { container, rerender } = renderWithLocale(
      <WindCell record={weatherDay()} />,
    );

    expect(container).toMatchSnapshot();

    rerender(<WindCell record={weatherDay({ windDirection: undefined })} />);
    rerender(<WindCell record={noDataDay('api_error')} />);

    expect(container).toMatchSnapshot();
  });
});
