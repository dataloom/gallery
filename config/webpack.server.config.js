/*
 * @flow
 */

/* eslint-disable no-console, import/no-extraneous-dependencies, react/require-extension */

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const devWebpackConfig = require('./webpack.config.dev.js');

const DEFAULT_PORT = 3030;
const DEFAULT_HOST = 'localhost';

const compiler = webpack(devWebpackConfig);
const devServer = new WebpackDevServer(compiler, devWebpackConfig.devServer);
devServer.listen(DEFAULT_PORT, DEFAULT_HOST, (error) => {

  if (error) {
    console.log(error);
  }
});
