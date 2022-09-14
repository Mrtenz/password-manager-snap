const commonShake = require('common-shakeify');

module.exports = {
  cliOptions: {
    src: './src/index.ts',
    port: 8001,
  },
  bundlerCustomizer: (bundler) => {
    bundler.plugin(commonShake);
  },
};
