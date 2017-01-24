/*
 * @flow
 */

/* eslint-disable no-underscore-dangle, import/no-extraneous-dependencies, import/extensions */

import ExtractTextPlugin from 'extract-text-webpack-plugin';
import Webpack from 'webpack';

import PACKAGE from '../../package.json';

import APP_CONFIG from '../app.config.js';
import APP_PATHS from '../app.paths.js';

import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN
} from '../auth/auth0.config.js';

import {
  isDev,
  isProd
} from '../env.js';

/*
 * loaders
 */

const BABEL_LOADER = {
  loader: 'babel-loader',
  test: /\.(js|jsx)$/,
  include: [
    APP_PATHS.ABS.SOURCE,
    APP_PATHS.ABS.TEST
  ]
};

const CSS_LOADER = {
  loader: ExtractTextPlugin.extract(
    'css-loader?modules&localIdentName=[local]--[hash:base64:5]&importLoader=1!postcss-loader?config=config/postcss/postcss.config.js'
  ),
  test: /\.css$/,
  exclude: /src\/core\/styles\/global\/.*\.css/
};

const CSS_LOADER_GLOBALS = {
  loader: ExtractTextPlugin.extract(
    'css-loader'
  ),
  test: /\.css$/,
  include: /src\/core\/styles\/global\/.*\.css/
};

const JSON_LOADER = {
  loader: 'json-loader',
  test: /\.json$/
};

const MEDIA_FILE_LOADER = {
  loader: 'file-loader',
  test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
  query: {
    name: `${APP_PATHS.REL.STATIC_MEDIA}/[name].[hash:8].[ext]`
  }
};

const MEDIA_URL_LOADER = {
  loader: 'url-loader',
  test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
  query: {
    limit: 10000,
    name: `${APP_PATHS.REL.STATIC_MEDIA}/[name].[hash:8].[ext]`
  }
};

/*
 * plugins
 */

const BANNER_PLUGIN = new Webpack.BannerPlugin({
  banner: APP_CONFIG.BANNER,
  entryOnly: true
});

const DEFINE_PLUGIN = new Webpack.DefinePlugin({
  __DEV__: JSON.stringify(isDev),
  __PROD__: JSON.stringify(isProd),
  __VERSION__: JSON.stringify(`v${PACKAGE.version}`),
  __AUTH0_CLIENT_ID__: JSON.stringify(AUTH0_CLIENT_ID),
  __AUTH0_DOMAIN__: JSON.stringify(AUTH0_DOMAIN)
});

const EXTRACT_TEXT_PLUGIN = new ExtractTextPlugin(`${APP_PATHS.REL.STATIC_CSS}/${APP_CONFIG.APP_CSS}`);

/*
 * base webpack config
 */

export default {
  bail: true,
  performance: {
    hints: false // disable performance hints for now
  },
  entry: [
    'babel-polyfill',
    APP_PATHS.ABS.APP_ENTRY
  ],
  output: {
    path: APP_PATHS.ABS.BUILD,
    publicPath: '/gallery/'
  },
  module: {
    rules: [
      BABEL_LOADER,
      CSS_LOADER,
      CSS_LOADER_GLOBALS,
      JSON_LOADER,
      MEDIA_FILE_LOADER,
      MEDIA_URL_LOADER
    ]
  },
  plugins: [
    DEFINE_PLUGIN,
    EXTRACT_TEXT_PLUGIN,
    BANNER_PLUGIN
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: [
      APP_PATHS.ABS.SOURCE,
      APP_PATHS.ABS.NODE
    ]
  }
};
