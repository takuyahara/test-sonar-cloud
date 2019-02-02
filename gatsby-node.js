const path = require('path');
const webpack = require('webpack');
const config = require('config');
const { BugsnagBuildReporterPlugin, BugsnagSourceMapUploaderPlugin } = require('webpack-bugsnag-plugins');
const bsConfig = config.get(`Bugsnag`);
const appVersion = require("./package.json").version;

exports.onCreateWebpackConfig = ({ stage, actions }) => {
  const webpackConfig = {
    resolve: {
      modules: [
        path.resolve(__dirname, "src"), 
        "node_modules"
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        //double stringify because node-config expects this to be a string
        'process.env.NODE_CONFIG': JSON.stringify(JSON.stringify(config)),
      })
    ],
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
  if (stage === `build-javascript`) {
    webpackConfig.plugins.push(
      new BugsnagBuildReporterPlugin({
        apiKey: bsConfig.API,
        appVersion: appVersion,
      }),
      new BugsnagSourceMapUploaderPlugin({
        apiKey: bsConfig.API,
        appVersion: appVersion,
        overwrite: true
      }),
    )
  }
  actions.setWebpackConfig(webpackConfig)
}
