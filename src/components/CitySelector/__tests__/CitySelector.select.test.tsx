import { describe, expect, it, vi } from 'vitest';

import { render } from '@testing-library/react';

import { location } from '../../../../test/fixtures';
import { CitySelector } from '../CitySelector';

const city = {
  ...location,
  label: 'Москва, Москва, Россия',
};

type SelectProps = {
  onSelect?: (value: string, option: { city?: typeof city }) => void;
};

let selectProps: SelectProps | undefined;

vi.mock('antd', async () => {
  const actual = await vi.importActual<typeof import('antd')>('antd');

  return {
    ...actual,
    AutoComplete: (props: SelectProps) => {
      selectProps = props;

      return <input aria-label="Город" />;
    },
  };
});

describe('CitySelector select', () => {
  it('игнорирует пункт без города', () => {
    const onSelect = vi.fn();

    render(
      <CitySelector
        errorMessage={null}
        isLocating={false}
        location={null}
        onDetectLocation={vi.fn()}
        onQueryChange={vi.fn()}
        onSelect={onSelect}
        query=""
        results={[city]}
        status="idle"
      />,
    );

    selectProps?.onSelect?.('Москва', {});

    expect(onSelect).not.toHaveBeenCalled();

    selectProps?.onSelect?.(city.label, { city });

    expect(onSelect).toHaveBeenCalledWith(city);
  });
});
