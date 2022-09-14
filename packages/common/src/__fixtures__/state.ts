import { VALID_NAMES } from './name';

export const VALID_STATES = [
  {
    names: VALID_NAMES,
  },
];

export const INVALID_STATES = [
  undefined,
  null,
  true,
  false,
  NaN,
  Infinity,
  0,
  '0',
  {},
  [],
  { names: undefined },
  { names: null },
  { names: true },
  { names: false },
  { names: NaN },
  { names: Infinity },
  { names: -Infinity },
  { names: 0 },
  { names: '0' },
  { names: {} },
];
