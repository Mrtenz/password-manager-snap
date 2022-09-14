import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',

  displayName: 'generator',

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
