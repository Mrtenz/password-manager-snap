import type { Config } from 'jest';

const config: Config = {
  displayName: 'frontend',

  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: {
          jsx: 'react-jsx',
        },
      },
    ],
  },

  testEnvironment: 'jsdom',

  setupFiles: ['<rootDir>/jest.setup.ts'],

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
