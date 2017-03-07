const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const APP_CONFIG = require('../app.config');
const APP_PATHS = require('../app.paths');
const PACKAGE = require('../../package');

const AUTH0_CONFIG = require('../auth/auth0.config');
const AUTH0_CLIENT_ID = AUTH0_CONFIG.AUTH0_CLIENT_ID,
  AUTH0_DOMAIN = AUTH0_CONFIG.AUTH0_DOMAIN;

const ENV = require('../env');
const isDev = ENV.isDev,
  isProd = ENV.isProd;


exports.BANNER_PLUGIN = new Webpack.BannerPlugin({
  banner: APP_CONFIG.BANNER,
  entryOnly: true
});

exports.DEFINE_PLUGIN = new Webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDev),
  __PROD__: JSON.stringify(isProd),
  __VERSION__: JSON.stringify(`v${PACKAGE.version}`),
  __AUTH0_CLIENT_ID__: JSON.stringify(AUTH0_CLIENT_ID),
  __AUTH0_DOMAIN__: JSON.stringify(AUTH0_DOMAIN)
});

exports.EXTRACT_TEXT_PLUGIN = new ExtractTextPlugin(`${APP_PATHS.REL.STATIC_CSS}/${APP_CONFIG.APP_CSS}`);