import type { JestEnvironmentConfig } from '@jest/environment';
import type { EnvironmentContext } from '@jest/environment';
import NodeEnvironment from 'jest-environment-node';
import type { WalletMockOptions } from './wallet';

export type SnapsEnvironmentOptions = WalletMockOptions;

export default class SnapsEnvironment extends NodeEnvironment {
  options: SnapsEnvironmentOptions;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.options = {
      mnemonicPhrase:
        'test test test test test test test test test test test ball',
      ...config.projectConfig.testEnvironmentOptions,
    };
  }

  async setup() {
    await super.setup();
    this.global.__snapMockOptions__ = this.options;
  }
}
