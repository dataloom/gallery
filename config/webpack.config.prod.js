/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, react/require-extension */

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = require('./paths');

const baseWebpackConfig = require('./webpack.config.base.js');

const output = Object.assign({}, baseWebpackConfig.output, {
  filename: `${PATHS.REL.STATIC_JS}/app.[hash:8].js`,
  chunkFilename: `${PATHS.REL.STATIC_JS}/app.chunk.[id].[chunkhash:8].js`
});

const plugins = []
  .concat(baseWebpackConfig.plugins)
  .concat(new webpack.optimize.OccurrenceOrderPlugin())
  .concat(
    new HtmlWebpackPlugin({
      inject: true,
      template: `${PATHS.ABS.SOURCE}/index.html`
    })
  )
  .concat(
    new webpack.optimize.CommonsChunkPlugin({
      name: 'react',
      filename: `${PATHS.REL.STATIC_JS}/react.js`,
      minChunks: Infinity
    })
  )
  .concat(
    new webpack.optimize.UglifyJsPlugin()
  );

module.exports = Object.assign({}, baseWebpackConfig, {
  output,
  plugins
});
