const withTs = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = withTs({
  webpack(config, options) {
    config.resolve.alias.client = './client';
    config.resolve.alias.server = './server';
    config.plugins.push(new ForkTsCheckerWebpackPlugin());
    // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
    return config;
  },
});
