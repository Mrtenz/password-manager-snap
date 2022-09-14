import { OnRpcRequestHandler } from '@metamask/snap-types';
import {
  getDerivationPath,
  generatePassword,
} from '@mrtenz/password-generator';
import type { ExtendedKey } from '@mrtenz/password-generator';
import { isName, isState, RpcMethod } from '@mrtenz/password-snap-common';
import { getState, setState } from './state';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case RpcMethod.ShowPassword: {
      const params = request.params;
      if (!isName(params)) {
        throw new Error(
          'Invalid params: Expected an object with a string "name" and number "mask" property.'
        );
      }

      const derivationPath = getDerivationPath(params.name).split('/');
      const { privateKey, chainCode } = (await wallet.request({
        method: 'snap_getBip32Entropy',
        params: {
          path: derivationPath,
          curve: 'secp256k1',
        },
      })) as ExtendedKey;

      const password = await generatePassword(
        { privateKey, chainCode },
        params.mask,
        20
      );

      const result = (await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Password',
            description: `You can find the password for ${params.name} below. Do not save this password anywhere, as it can be generated again at any time.`,
            textAreaContent: password,
          },
        ],
      })) as boolean;

      if (result) {
        const state = await getState();
        await setState({
          ...state,
          names: [...state.names, { name: params.name, mask: params.mask }],
        });
      }

      break;
    }

    case RpcMethod.GetNicknames: {
      return await getState();
    }

    case RpcMethod.RemoveNickname: {
      const params = request.params;
      if (!isName(params)) {
        throw new Error(
          'Invalid params: Expected an object with a string "name" and number "mask" property.'
        );
      }

      const state = await getState();
      await setState({
        ...state,
        names: state.names.filter(
          (value) => !(value.name === params.name && value.mask === params.mask)
        ),
      });

      break;
    }

    case RpcMethod.ImportNicknames: {
      const params = request.params;
      if (!isState(params)) {
        throw new Error(
          'Invalid params: Expected an array consisting of objects with a string "name" and number "mask" property.'
        );
      }

      const state = await getState();
      await setState({
        ...state,
        names: [...state.names, ...params.names],
      });

      break;
    }
  }
};
