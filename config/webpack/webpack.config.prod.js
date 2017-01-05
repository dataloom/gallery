/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import HtmlWebpackPlugin from 'html-webpack-plugin';
import Webpack from 'webpack';

import APP_CONFIG from '../app.config.js';
import APP_PATHS from '../app.paths.js';

import baseWebpackConfig from './webpack.config.base.js';

const output = Object.assign({}, baseWebpackConfig.output, {
  filename: `${APP_PATHS.REL.STATIC_JS}/app.[hash:8].js`,
  chunkFilename: `${APP_PATHS.REL.STATIC_JS}/app.chunk.[id].[chunkhash:8].js`,
  publicPath: '/gallery'
});

const plugins = [
  new Webpack.optimize.OccurrenceOrderPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    template: `${APP_PATHS.ABS.SOURCE}/${APP_CONFIG.APP_INDEX_HTML}`
  }),
  new Webpack.optimize.UglifyJsPlugin(),
  ...baseWebpackConfig.plugins
];

export default Object.assign({}, baseWebpackConfig, {
  output,
  plugins
});
