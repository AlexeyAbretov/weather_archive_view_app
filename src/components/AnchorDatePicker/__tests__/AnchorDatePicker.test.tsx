import { describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocale } from '../../../../test/render';
import { AnchorDatePicker } from '../AnchorDatePicker';

describe('AnchorDatePicker', () => {
  it('показывает дату и недоступное поле', () => {
    const onChange = vi.fn();
    const { container, rerender } = renderWithLocale(
      <AnchorDatePicker
        onChange={onChange}
        value={{ year: 2020, month: 9, day: 15 }}
      />,
    );

    expect(screen.getByDisplayValue('15.09.2020')).toBeInTheDocument();
    expect(container).toMatchSnapshot();

    rerender(
      <AnchorDatePicker
        disabled
        onChange={onChange}
        value={{ year: 2020, month: 9, day: 15 }}
      />,
    );

    expect(screen.getByDisplayValue('15.09.2020')).toBeDisabled();
  });

  it('передаёт выбранный день наружу', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderWithLocale(
      <AnchorDatePicker
        onChange={onChange}
        value={{ year: 2020, month: 9, day: 15 }}
      />,
    );

    await user.click(screen.getAllByDisplayValue('15.09.2020')[0]);
    await user.click(screen.getAllByText('20')[0]);

    expect(onChange).toHaveBeenCalledWith({
      year: 2020,
      month: 9,
      day: 20,
    });
  });
});
