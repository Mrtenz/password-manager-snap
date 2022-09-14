import { jest } from '@jest/globals';

export const snapConfirm = jest
  .fn<() => Promise<boolean>>()
  .mockImplementation(async () => true);
