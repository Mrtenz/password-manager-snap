import assert from 'assert';
import { jest } from '@jest/globals';
import { Maybe } from '@metamask/providers/dist/utils';
import { SnapProvider } from '@metamask/snap-types';
import { isPlainObject, PlainObject } from '@metamask/utils';
import { bytesToHex } from '@noble/hashes/utils';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';
import { TEST_MNEMONIC } from '../__fixtures__';

export const getWalletMock = (): SnapProvider => {
  let state: PlainObject | null = null;

  const request = jest
    .fn<SnapProvider['request']>()
    .mockImplementation(async ({ method, params }): Promise<Maybe<unknown>> => {
      // Mock implementation of the `snap_getBip32Entropy` method, which derives a
      // node from `TEST_MNEMONIC`.
      if (method === 'snap_getBip32Entropy') {
        assert(isPlainObject(params));
        assert(Array.isArray(params.path));

        const seed = await mnemonicToSeed(TEST_MNEMONIC);
        const node = HDKey.fromMasterSeed(seed);
        const child = node.derive(params.path.join('/'));

        assert(child.privateKey);
        assert(child.chainCode);

        return {
          privateKey: bytesToHex(child.privateKey),
          chainCode: bytesToHex(child.chainCode),
        };
      }

      if (method === 'snap_manageState') {
        assert(Array.isArray(params));
        assert(typeof params[0] === 'string');

        if (params[0] === 'get') {
          return state;
        }

        if (params[0] === 'update') {
          assert(isPlainObject(params[1]));
          state = params[1];
          return;
        }

        if (params[0] === 'clear') {
          state = null;
          return;
        }
      }

      // Mock implementation of the `snap_confirm` method, which always returns
      // true.
      if (method === 'snap_confirm') {
        return true;
      }

      throw new Error(`Method "${method}" not implemented.`);
    });

  return { request } as unknown as SnapProvider;
};
