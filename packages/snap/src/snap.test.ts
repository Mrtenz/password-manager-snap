import { describe, it, expect } from '@jest/globals';
import { getDerivationPath } from '@mrtenz/password-generator';
import { passwords } from './__fixtures__';
import { onRpcRequest } from './snap';

describe('onRpcRequest', () => {
  describe('ShowPassword', () => {
    it.each(passwords)(
      'shows the password in a confirmation prompt',
      async ({ mask, name, password }) => {
        await onRpcRequest({
          request: {
            jsonrpc: '2.0',
            id: 1,
            method: 'show_password',
            params: {
              name,
              mask,
            },
          },
          origin: 'test',
        });

        expect(wallet.request).toHaveBeenNthCalledWith(1, {
          method: 'snap_getBip32Entropy',
          params: {
            path: getDerivationPath(name).split('/'),
            curve: 'secp256k1',
          },
        });

        expect(wallet.request).toHaveBeenNthCalledWith(2, {
          method: 'snap_confirm',
          params: [
            {
              prompt: 'Password',
              description: `You can find the password for ${name} below. Do not save this password anywhere, as it can be generated again at any time.`,
              textAreaContent: password,
            },
          ],
        });
      }
    );
  });
});
