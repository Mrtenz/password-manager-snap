import assert from 'assert';
import type { Maybe } from '@metamask/providers/dist/utils';
import type { SnapProvider } from '@metamask/snap-types';
import type { PlainObject } from '@metamask/utils';
import { isPlainObject } from '@metamask/utils';
import { bytesToHex } from '@noble/hashes/utils';
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';
import { snapConfirm } from './mock';

export interface WalletMockOptions {
  mnemonicPhrase: string;
}

export const getWalletMock = ({
  mnemonicPhrase,
}: WalletMockOptions): SnapProvider => {
  let state: PlainObject | null = null;

  const request: SnapProvider['request'] = jest
    .fn()
    .mockImplementation(async ({ method, params }): Promise<Maybe<unknown>> => {
      // Mock implementation of the `snap_getBip32Entropy` method, which derives a
      // node from `mnemonicPhrase`.
      if (method === 'snap_getBip32Entropy') {
        assert(isPlainObject(params));
        assert(Array.isArray(params.path));

        const seed = await mnemonicToSeed(mnemonicPhrase);
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
        return await snapConfirm();
      }

      throw new Error(`Method "${method}" not implemented.`);
    });

  return { request } as unknown as SnapProvider;
};
