import { jest } from '@jest/globals';

global.URL.createObjectURL = jest
  .fn<typeof URL.createObjectURL>()
  .mockImplementation(() => 'blob:foo');
