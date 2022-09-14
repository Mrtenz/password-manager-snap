/**
 * Sets of possible characters used for password generation.
 */
export const PASSWORD_SETS = [
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  'abcdefghijklmnopqrstuvwxyz',
  '0123456789',
  '-',
  '_',
  ' ',
  '"#$%&\'*+,./:;=?!@\\^`|~',
  '[]{}()<>',
];

/**
 * The default minimum number of characters to use from each set.
 */
export const DEFAULT_MINIMUM_FROM_SET = [1, 1, 1, 0, 0, 1, 0, 0];
