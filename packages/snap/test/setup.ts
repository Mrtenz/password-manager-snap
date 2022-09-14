import type { WalletMockOptions } from './wallet';
import { getWalletMock } from './wallet';

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __snapMockOptions__: WalletMockOptions;

Object.assign(global, {
  wallet: getWalletMock(__snapMockOptions__),
});
