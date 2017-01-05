/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, react/require-extension */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const CONSTS = require('./consts');
const PATHS = require('./paths');

const baseWebpackConfig = require('./webpack.config.base.js');

// TODO - waiting on RHL v3
// const APP_ENTRY = [
//   'webpack-dev-server/client?http://localhost:3030',
//   'webpack/hot/only-dev-server',
//   'react-hot-loader/patch',
//   PATHS.ABS.APP_ENTRY
// ];

const APP_ENTRY = [
  'babel-polyfill',
  PATHS.ABS.APP_ENTRY
];

const output = Object.assign({}, baseWebpackConfig.output, {
  filename: `${PATHS.REL.STATIC_JS}/app.js`
});

const plugins = []
  .concat(baseWebpackConfig.plugins)
  .concat(new webpack.NamedModulesPlugin())
  // TODO - waiting on RHL v3
  // .concat(new webpack.HotModuleReplacementPlugin())
  .concat(
    new HtmlWebpackPlugin({
      inject: true,
      template: `${PATHS.ABS.SOURCE}/${CONSTS.APP_HTML}`
    })
  );

module.exports = Object.assign({}, baseWebpackConfig, {
  output,
  plugins,
  entry: APP_ENTRY,
  devServer: {
    hot: false,
    publicPath: baseWebpackConfig.output.publicPath
  }
});
