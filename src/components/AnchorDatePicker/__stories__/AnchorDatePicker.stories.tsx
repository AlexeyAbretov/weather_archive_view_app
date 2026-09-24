import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { AnchorDatePicker } from '../AnchorDatePicker';

const meta = {
  title: 'Components/AnchorDatePicker',
  component: AnchorDatePicker,
  args: {
    onChange: fn(),
    value: { year: 2020, month: 9, day: 15 },
  },
} satisfies Meta<typeof AnchorDatePicker>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
