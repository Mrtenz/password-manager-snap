import type { MetaMaskInpageProvider } from '@metamask/providers';
import { RequestArguments } from '@metamask/providers/dist/BaseProvider';
import { JsonRpcError } from '@metamask/types';
import { Name, RpcMethod, State } from '@mrtenz/password-snap-common';
import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { SNAP_ID, SNAP_VERSION } from './constants';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

enum Tag {
  Snaps = 'Snaps',
  Nicknames = 'Nicknames',
}

const request: BaseQueryFn<RequestArguments> = async ({ method, params }) => {
  try {
    const data = await window.ethereum.request({ method, params });

    return { data };
  } catch (error) {
    return { error };
  }
};

export interface InstallSnapResult {
  snaps: {
    [key: string]: {
      error: JsonRpcError;
    };
  };
}

export interface GeneratePasswordArgs {
  name: string;
  mask?: number;
}

export const api = createApi({
  reducerPath: 'snap',
  baseQuery: request,
  tagTypes: [Tag.Snaps, Tag.Nicknames],
  endpoints(build) {
    return {
      getFlask: build.query<boolean, void>({
        query: () => ({
          method: 'web3_clientVersion',
        }),
        transformResponse: (value: string) => value.includes('flask'),
      }),

      getSnaps: build.query<Record<string, { error?: string }>, void>({
        query: () => ({
          method: 'wallet_getSnaps',
        }),
        providesTags: [Tag.Snaps],
      }),

      getNicknames: build.query<State, void>({
        query: () => ({
          method: 'wallet_invokeSnap',
          params: [
            SNAP_ID,
            {
              method: 'get_nicknames',
            },
          ],
        }),
        providesTags: [Tag.Nicknames],
      }),

      installSnap: build.mutation<InstallSnapResult, void>({
        query: () => ({
          method: 'wallet_enable',
          params: [
            {
              wallet_snap: {
                [SNAP_ID]: {
                  version: SNAP_VERSION,
                },
              },
            },
          ],
        }),
        transformResponse: ({ snaps }: InstallSnapResult) => {
          if (snaps[SNAP_ID].error) {
            throw new Error(snaps[SNAP_ID].error.message);
          }

          return { snaps };
        },
        invalidatesTags: [Tag.Snaps],
      }),

      generatePassword: build.mutation<string, GeneratePasswordArgs>({
        query: ({ name, mask = 0b11111111 }) => ({
          method: 'wallet_invokeSnap',
          params: [
            SNAP_ID,
            {
              method: RpcMethod.ShowPassword,
              params: {
                name,
                mask,
              },
            },
          ],
        }),
        invalidatesTags: [Tag.Nicknames],
      }),

      removeNickname: build.mutation<void, Name>({
        query: ({ name, mask }) => ({
          method: 'wallet_invokeSnap',
          params: [
            SNAP_ID,
            {
              method: RpcMethod.RemoveNickname,
              params: {
                name,
                mask,
              },
            },
          ],
        }),
        invalidatesTags: [Tag.Nicknames],
      }),

      importNicknames: build.mutation<void, State>({
        query: ({ names }) => ({
          method: 'wallet_invokeSnap',
          params: [
            SNAP_ID,
            {
              method: RpcMethod.ImportNicknames,
              params: {
                names,
              },
            },
          ],
        }),
        invalidatesTags: [Tag.Nicknames],
      }),
    };
  },
});

export const {
  useGetFlaskQuery,
  useGetSnapsQuery,
  useGetNicknamesQuery,
  useInstallSnapMutation,
  useGeneratePasswordMutation,
  useRemoveNicknameMutation,
  useImportNicknamesMutation,
} = api;
