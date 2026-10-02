import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

import '@testing-library/jest-dom/vitest';

afterEach(() => {
  cleanup();
});

class GeolocationPositionErrorPolyfill extends Error {
  static readonly PERMISSION_DENIED = 1;

  static readonly POSITION_UNAVAILABLE = 2;

  static readonly TIMEOUT = 3;

  readonly PERMISSION_DENIED = 1;

  readonly POSITION_UNAVAILABLE = 2;

  readonly TIMEOUT = 3;

  code: number;

  constructor(code = 1) {
    super('geolocation');
    this.code = code;
  }
}

if (typeof globalThis.GeolocationPositionError === 'undefined') {
  globalThis.GeolocationPositionError =
    GeolocationPositionErrorPolyfill as unknown as typeof GeolocationPositionError;
}

class ResizeObserverStub {
  observe(): void {}

  unobserve(): void {}

  disconnect(): void {}
}

window.ResizeObserver = ResizeObserverStub;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
