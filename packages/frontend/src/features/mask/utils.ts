export enum Mask {
  Lowercase = 'Lowercase',
  Uppercase = 'Uppercase',
  Numbers = 'Numbers',
  SpacesDashes = 'Spaces and dashes',
  Symbols = 'Symbols',
}

export const MASKS = [
  {
    name: Mask.Symbols,
    length: 2,
  },
  {
    name: Mask.SpacesDashes,
    length: 3,
  },
  {
    name: Mask.Numbers,
    length: 1,
  },
  {
    name: Mask.Lowercase,
    length: 1,
  },
  {
    name: Mask.Uppercase,
    length: 1,
  },
];

/**
 * Get a set mask from an array of mask names. The set mask consists of eight
 * bits, where each bit represents a mask.
 *
 * @param masks - The array of mask names that should be set.
 * @returns The set mask as a number.
 */
export const getSetMask = (masks: Mask[]): number => {
  const binaryString = MASKS.reduce<string>((result, mask) => {
    if (masks.includes(mask.name)) {
      return result + '1'.repeat(mask.length);
    }

    return result + '0'.repeat(mask.length);
  }, '');

  return Number(`0b${binaryString}`);
};

/**
 * Get an array of mask names from a set mask. The set mask consists of eight
 * bits, where each bit represents a mask.
 *
 * @param setMask - The set mask as a number.
 * @returns The array of mask names that are set.
 */
export const getMaskList = (setMask: number): Mask[] => {
  const binaryString = setMask.toString(2).padStart(8, '0');
  const { masks } = MASKS.reduce<{ pointer: number; masks: Mask[] }>(
    ({ masks, pointer }, mask) => {
      const maskString = binaryString.slice(pointer, pointer + mask.length);
      if (maskString === '1'.repeat(mask.length)) {
        return {
          masks: [...masks, mask.name],
          pointer: pointer + mask.length,
        };
      }

      return {
        masks,
        pointer: pointer + mask.length,
      };
    },
    { pointer: 0, masks: [] }
  );

  return masks;
};
