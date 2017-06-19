/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, import/extensions */

import HtmlWebpackPlugin from 'html-webpack-plugin';
import DashboardPlugin from 'webpack-dashboard/plugin';
import Webpack from 'webpack';

import APP_CONFIG from '../app.config.js';
import APP_PATHS from '../app.paths.js';

import baseWebpackConfig from './webpack.config.base.js';

const DEV_SERVER_PORT = 9000;

// TODO - waiting on RHL v3
const entry = [
  'babel-polyfill',
  'react-hot-loader/patch',
  `webpack-dev-server/client?http://localhost:${DEV_SERVER_PORT}`,
  APP_PATHS.ABS.APP_ENTRY
];

const output = Object.assign({}, baseWebpackConfig.output, {
  filename: `${APP_PATHS.REL.STATIC_JS}/${APP_CONFIG.APP_JS}`,
  publicPath: '/gallery/'
});

const plugins = [
  new DashboardPlugin(),
  new Webpack.NamedModulesPlugin(),
  // TODO - waiting on RHL v3
  new Webpack.HotModuleReplacementPlugin(),
  new HtmlWebpackPlugin({
    inject: true,
    template: `${APP_PATHS.ABS.SOURCE}/${APP_CONFIG.APP_INDEX_HTML}`
    // favicon: `${APP_PATHS.ABS.SOURCE}/images/favicon.png`
  }),
  ...baseWebpackConfig.plugins
];

export default Object.assign({}, baseWebpackConfig, {
  entry,
  output,
  plugins,
  devServer: {
    hot: true,
    historyApiFallback: true,
    port: DEV_SERVER_PORT,
    contentBase: APP_PATHS.ABS.BUILD,
    publicPath: baseWebpackConfig.output.publicPath
  },
  // devtool: 'eval-source-map'
  devtool: false
});
