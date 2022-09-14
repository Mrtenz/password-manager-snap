import type { Config } from 'jest';
import { TEST_MNEMONIC } from './src/__fixtures__';

const config: Config = {
  preset: 'ts-jest',

  displayName: 'snap',

  testEnvironment: './test/environment.ts',
  testEnvironmentOptions: {
    mnemonicPhrase: TEST_MNEMONIC,
  },
  setupFilesAfterEnv: ['./test/setup.ts'],

  clearMocks: true,

  coverageProvider: 'v8',
  collectCoverageFrom: [
    './src/**/*.ts',
    './src/**/*.tsx',
    '!./src/**/__fixtures__/**',
    '!./src/**/__mocks__/**',
    '!./src/types/vendor/**',
  ],
};

export default config;
