import { sha256 } from '@noble/hashes/sha256';
import { hexToBytes } from '@noble/hashes/utils';
import CtrDRBG from 'bcrypto/lib/ctr-drbg';
import { DEFAULT_MINIMUM_FROM_SET, PASSWORD_SETS } from './sets';

export type ExtendedKey = {
  privateKey: Uint8Array | string;
  chainCode: Uint8Array | string;
};

export const HARDENED_OFFSET = 0x80000000;

/**
 * A magic value, used as first part of the derivation path.
 */
export const DERIVE_PASSWORD_PATH = 0x80505744;

/**
 * Turn a derivation path index array into a derivation path string, i.e.,
 * `m/44'/60'/...`.
 *
 * @param derivationPath - The derivation path index array.
 * @returns The derivation path string.
 */
const derivationPathToString = (derivationPath: number[]): string =>
  `m/${derivationPath
    .map((index) =>
      index >= HARDENED_OFFSET ? `${index - HARDENED_OFFSET}'` : index
    )
    .join('/')}`;

/**
 * Get a BIP-32 derivation path from a nickname. It consists of 9 indices,
 * starting with `0x80505744`, followed by eight indices based on the SHA-256
 * hash.
 *
 * @param name - The nickname of the password.
 * @returns The BIP-32 derivation path as number array.
 */
export const getDerivationPath = (name: string): string => {
  // Since we're mutating the hash, we create a copy of it here.
  // cx_hash_sha256(data, dataSize, tmp, sizeof(tmp));
  const hashArray = sha256(name);
  const hashView = new DataView(hashArray.buffer);

  const array = [DERIVE_PASSWORD_PATH];
  for (let index = 0; index < 8; index++) {
    // derive[i + 1] = 0x80000000 |
    //   (tmp[4 * i] << 24) |
    //   (tmp[4 * i + 1] << 16) |
    //   (tmp[4 * i + 2] << 8) |
    //   (tmp[4 * i + 3]);
    hashArray[index * 4] |= 0x80;
    array.push(hashView.getUint32(index * 4));
  }

  return derivationPathToString(array);
};

/**
 * Get a random deterministic index from a seeded DRBG context.
 *
 * @param drbg - The DRGB context to get the random index from.
 * @param modulo - The maximum number.
 * @returns A random deterministic number.
 */
// uint8_t rng_u8_modulo(mbedtls_ctr_drbg_context *drbg, uint8_t modulo)
const getRandomIndex = (drbg: CtrDRBG, modulo: number): number => {
  // uint32_t rng_max = 256 % modulo;
  // uint32_t rng_limit = 256 - rng_max;
  const max = 256 % modulo;
  const limit = 256 - max;

  let candidate = 0;
  do {
    // mbedtls_ctr_drbg_random(drbg, &candidate, 1)
    candidate = drbg.generate(1)[0];
  } while (candidate > limit);

  return candidate % modulo;
};

/**
 * Randomly shuffle an array based on a DRBG context.
 *
 * @param drbg - The DRGB context to get the random indices from.
 * @param array - The array to randomly shuffle.
 * @returns The shuffled array.
 */
// void shuffle_array(mbedtls_ctr_drbg_context *drbg, uint8_t *buffer, uint32_t size)
const shuffleArray = <Array extends unknown[]>(
  drbg: CtrDRBG,
  array: Array
): Array => {
  for (let index = array.length - 1; index > 0; index--) {
    // uint32_t index = rng_u8_modulo(drbg, i + 1);
    // uint8_t tmp = buffer[i];
    const randomIndex = getRandomIndex(drbg, index + 1);
    const temp = array[index];

    // buffer[i] = buffer[index];
    // buffer[index] = tmp;
    array[index] = array[randomIndex];
    array[randomIndex] = temp;
  }

  return array;
};

/**
 * Randomly shuffle a string based on a DRBG context. This is a wrapper of
 * {@link shuffleArray}, but splits the string into an array of characters
 * first. The characters are then joined back together.
 *
 * @param drbg - The DRGB context to get the random indices from.
 * @param value - The string to randomly shuffle.
 * @returns The shuffled string.
 */
const shuffleString = (drbg: CtrDRBG, value: string) =>
  shuffleArray(drbg, value.split('')).join('');

// void sample(mbedtls_ctr_drbg_context *drbg, const uint8_t *set, uint32_t setSize, uint8_t *out,
//   uint32_t size)
const sample = (drbg: CtrDRBG, set: string, size: number): string => {
  let characters = '';

  for (let index = 0; index < size; index++) {
    // uint32_t index = rng_u8_modulo(drbg, setSize);
    // out[i] = set[index];
    const randomIndex = getRandomIndex(drbg, set.length);
    characters += set[randomIndex];
  }

  return characters;
};

/**
 * Get a set of characters from the set mask. The set mask is a 32-bit integer
 * where each bit represents a set. The first bit represents the first set, the
 * second bit the second set, and so on. The set mask is used to determine which
 * sets to use for the password.
 *
 * @param drbg - The DRGB context to get the random indices from.
 * @param setMask - The set mask to use.
 * @param minimumFromSet - The minimum number of characters to use from each
 * set.
 * @param sets - The sets to use.
 * @returns The set of characters, and minimum required output.
 */
const getCharacterSets = (
  drbg: CtrDRBG,
  setMask: number,
  minimumFromSet: number[] = DEFAULT_MINIMUM_FROM_SET,
  sets = PASSWORD_SETS
): [characters: string, output: string] => {
  let characters = '';
  let output = '';

  for (let index = 0; setMask && index < sets.length; index++, setMask >>= 1) {
    if (setMask & 1) {
      // const uint8_t *set = (const uint8_t *) PIC(SETS[i]);
      const set = sets[index];

      // uint32_t setSize = strlen((const char *) set);
      // os_memcpy(setChars + setCharsOffset, set, setSize);
      characters += set;

      // For minimum required characters, sample random characters from the set, and add them to the
      // output.
      if (minimumFromSet[index] > 0) {
        // sample(drbg, set, setSize, out + outOffset, minFromSet[i]);
        output += sample(drbg, set, minimumFromSet[index]);
      }
    }
  }

  return [characters, output];
};

/**
 * Get an array from a byte-like value. If the input is a string, it's assumed
 * to be a hexadecimal encoded string, and turned into a Uint8Array. If the
 * input is a Uint8Array, it's returned as-is.
 *
 * @param value - The value to get the array from.
 * @returns The array.
 */
const getArray = (value: string | Uint8Array): Uint8Array => {
  if (typeof value === 'string') {
    return hexToBytes(value);
  }

  return value;
};

/**
 * Generate a password from an extended private key and nickname. This works as
 * follows:
 *
 * 1. The nickname is SHA-256 hashed, and turned into 8 4-byte groups.
 * 2. A private key and chain code are derived from the mnemonic phrase, using
 *    `m / 0x80505744` and the previously generated 4-byte groups.
 * 3. The private key and chain code are combined and SHA-256 hashed.
 * 4. A CTR-DRBG random number generator is initialised using the previous
 *    SHA-256 hash as entropy.
 * 5. Random characters are picked from the set, using the CTR-DRBG random
 *    number generator.
 *
 * The result is a deterministically generated password, based on the mnemonic
 * phrase and nickname.
 *
 * @param extendedKey - The private key and chain code to derive the password
 * from. These must be generated from the derivation path returned by the
 * `getDerivationPath` function.
 * @param extendedKey.chainCode - The chain code.
 * @param extendedKey.privateKey - The private key.
 * @param setMask - The set mask, which determines which sets will be used.
 * @param length - The length of the password to generate.
 * @returns The generated password as a string.
 */
export const generatePassword = async (
  { privateKey, chainCode }: ExtendedKey,
  setMask: number,
  length: number
): Promise<string> => {
  // Generate entropy from the private key and chain code.
  // cx_hash_sha256(tmp, 64, entropy, sizeof(entropy));
  const entropy = sha256(
    new Uint8Array([...getArray(privateKey), ...getArray(chainCode)])
  );

  // Initialise DRBG using the private key and chain code as entropy.
  // mbedtls_ctr_drbg_init(&ctx);
  // mbedtls_ctr_drbg_seed(&ctx, entropyProvider2, NULL, NULL, 0)
  const drbg = new CtrDRBG(256, true, Buffer.from(entropy));

  // Get the character sets for the password generation. Note that this also
  // includes an output string, which contains a minimum number of characters
  // from each set.
  const [characters, output] = getCharacterSets(drbg, setMask);

  // Sample random characters from the set, and add them to the output. The
  // resulting password is then shuffled, resulting in the output password.
  // sample(drbg, setChars, setCharsOffset, out + outOffset, size - outOffset);
  // shuffle_array(drbg, out, size);
  const password = output + sample(drbg, characters, length - output.length);
  return shuffleString(drbg, password);
};
