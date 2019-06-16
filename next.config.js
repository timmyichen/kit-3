const withTs = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = withTs({
  webpack(config, options) {
    config.resolve.alias.client = './client';
    config.resolve.alias.server = './server';
    // config.plugins.push(new ForkTsCheckerWebpackPlugin());
    return config;
  },
});
