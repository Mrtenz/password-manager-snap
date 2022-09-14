import { describe, it, expect } from '@jest/globals';
import { INVALID_NAMES, VALID_NAMES } from './__fixtures__';
import { INVALID_STATES, VALID_STATES } from './__fixtures__/state';
import { isName, isState } from './validation';

describe('isName', () => {
  it.each(VALID_NAMES)('returns true for a valid name object', (value) => {
    expect(isName(value)).toBe(true);
  });

  it.each(INVALID_NAMES)(
    'returns false for an invalid name object',
    (value) => {
      expect(isName(value)).toBe(false);
    }
  );
});

describe('isState', () => {
  it.each(VALID_STATES)('returns true for a valid state object', (value) => {
    expect(isState(value)).toBe(true);
  });

  it.each(INVALID_STATES)(
    'returns false for an invalid state object',
    (value) => {
      expect(isState(value)).toBe(false);
    }
  );
});
