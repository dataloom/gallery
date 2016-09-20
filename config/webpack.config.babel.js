/*
 * @flow
 */

/* eslint-disable no-underscore-dangle, import/no-extraneous-dependencies, react/require-extension */

const ENV = require('./env.js');

const devWebpackConfig = require('./webpack.config.dev.js');
const prodWebpackConfig = require('./webpack.config.prod.js');

const appWebpackConfig = {};

if (ENV.__DEV__) {
  Object.assign(appWebpackConfig, devWebpackConfig);
}
else if (ENV.__PROD__) {
  Object.assign(appWebpackConfig, prodWebpackConfig);
}

module.exports = appWebpackConfig;
