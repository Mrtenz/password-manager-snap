export const VALID_NAMES = [
  {
    name: 'foo',
    mask: 0,
  },
  {
    name: 'bar',
    mask: 1,
  },
  {
    name: 'baz',
    mask: 2,
  },
  {
    name: 'qux',
    mask: 3,
  },
];

export const INVALID_NAMES = [
  undefined,
  null,
  true,
  false,
  NaN,
  Infinity,
  -Infinity,
  0,
  '0',
  {},
  [],
  { name: 'foo' },
  { mask: 0 },
  { name: 0, mask: 0 },
  { name: 'foo', mask: '0' },
];
