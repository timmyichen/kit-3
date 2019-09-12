const withTs = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = withTs({
  webpack(config, options) {
    if (options.dev) {
      config.plugins.push(new ForkTsCheckerWebpackPlugin());
    }

    if (options.isServer) {
      config.resolve.alias.client = './client';
      config.resolve.alias.generated = './generated-gql';
    } else {
      config.resolve.alias.server = './server';
    }
    // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
    return config;
  },
});
