import { describe, expect, it, vi } from 'vitest';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithLocale } from '../../../../test/render';
import { ModeSwitcher } from '../ModeSwitcher';

describe('ModeSwitcher', () => {
  it('переключает режим', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = renderWithLocale(
      <ModeSwitcher onChange={onChange} value="A" />,
    );

    expect(container).toMatchSnapshot();

    await user.click(screen.getByText('По неделям (B)'));

    expect(onChange).toHaveBeenCalledWith('B');
  });
});
