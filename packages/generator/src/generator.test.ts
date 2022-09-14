import assert from 'assert';
import { describe, expect, it } from '@jest/globals';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeedSync } from '@scure/bip39';
import passwords from './__fixtures__/passwords.json';
import { generatePassword, getDerivationPath } from './generator';

const TEST_MNEMONIC =
  'glory promote mansion idle axis finger extra february uncover one trip resource lawn turtle enact monster seven myth punch hobby comfort wild raise skin';

describe('getDerivationPath', () => {
  it('returns an array of indices', () => {
    expect(getDerivationPath('foo')).toBe(
      "m/5265220'/740734059'/1761592975'/2040218940'/489701684'/323104112'/1686355872'/2039111304'/1650911150'"
    );
  });
});

describe('generatePassword', () => {
  const seed = mnemonicToSeedSync(TEST_MNEMONIC);
  const node = HDKey.fromMasterSeed(seed);

  it.each(passwords)(
    'generates a deterministic password',
    async ({ mask, name, password }) => {
      const derivationPath = getDerivationPath(name);
      const { privateKey, chainCode } = node.derive(derivationPath);

      assert(privateKey);
      assert(chainCode);

      expect(await generatePassword({ privateKey, chainCode }, mask, 20)).toBe(
        password
      );
    }
  );
});
