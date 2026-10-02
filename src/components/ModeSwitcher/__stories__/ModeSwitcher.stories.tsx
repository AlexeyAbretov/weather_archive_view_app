import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { ModeSwitcher } from '../ModeSwitcher';

const meta = {
  title: 'Components/ModeSwitcher',
  component: ModeSwitcher,
  args: {
    onChange: fn(),
    value: 'A',
  },
} satisfies Meta<typeof ModeSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Years: Story = {};

export const Weeks: Story = {
  args: {
    value: 'B',
  },
};
