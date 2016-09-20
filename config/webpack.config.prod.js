/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, react/require-extension */

const webpack = require('webpack');

const PATHS = require('./paths');

const baseWebpackConfig = require('./webpack.config.base.js');

const output = Object.assign({}, baseWebpackConfig.output, {
  filename: `${PATHS.REL.STATIC_JS}/app.[hash:8].js`,
  chunkFilename: `${PATHS.REL.STATIC_JS}/app.chunk.[id].[chunkhash:8].js`
});

const plugins = []
  .concat(baseWebpackConfig.plugins)
  .concat(new webpack.optimize.DedupePlugin())
  .concat(new webpack.optimize.OccurrenceOrderPlugin())
  .concat(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        unused: false,
        warnings: false
      },
      comments: false,
      mangle: false,
      sourceMap: false
    })
  );

module.exports = Object.assign({}, baseWebpackConfig, {
  output,
  plugins
});
