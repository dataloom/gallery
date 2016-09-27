/*
 * @flow
 */

/* eslint-disable import/no-extraneous-dependencies, react/require-extension */

const webpack = require('webpack');
const CONSTS = require('./consts');
const ENV = require('./env.js');
const PATHS = require('./paths.js');
const PACKAGE = require('../package.json');

const APP_GLOBALS = {
  __VERSION__: `v${PACKAGE.version}`
};

Object.assign(APP_GLOBALS, ENV);

/*
 * loaders
 */

const BABEL_LOADER = {
  loader: 'babel',
  test: /\.(js|jsx)$/,
  include: [
    PATHS.ABS.SOURCE,
    PATHS.ABS.TEST
  ]
};

// TODO - waiting on webpack 2 to finalize their patter for pre/post-loaders
// const ESLINT_LOADER = {
//   loader: 'eslint',
//   test: /\.(js|jsx)$/,
//   include: [
//     PATHS.ABS.SOURCE,
//     PATHS.ABS.TEST
//   ]
// };

const JSON_LOADER = {
  loader: 'json',
  test: /\.json$/
};

const MEDIA_FILE_LOADER = {
  loader: 'file',
  test: CONSTS.MEDIA_FILE_REGEX,
  query: {
    name: 'static/media/[name].[hash:8].[ext]'
  }
};

const MEDIA_URL_LOADER = {
  loader: 'url',
  test: CONSTS.MEDIA_URL_REGEX,
  query: {
    limit: 10000,
    name: 'static/media/[name].[hash:8].[ext]'
  }
};

const CSS_LOADER = {
  loader: 'style!css',
  test: /\.css$/
};

/*
 * plugins
 */

const definePluginProperties = Object.keys(APP_GLOBALS).reduce((previous, key) => {
  const result = Object.assign({}, previous);
  result[key] = JSON.stringify(APP_GLOBALS[key]);
  return result;
}, {});

/*
 * base webpack config
 */

module.exports = {
  bail: true,
  entry: {
    app: PATHS.ABS.APP_ENTRY,
    vendor: [
      'react'
    ]
  },
  output: {
    path: PATHS.ABS.BUILD,
    publicPath: '/'
  },
  module: {
    rules: [
      BABEL_LOADER,
      JSON_LOADER,
      MEDIA_FILE_LOADER,
      MEDIA_URL_LOADER,
      CSS_LOADER
    ],
    noParse: []
  },
  plugins: [
    new webpack.DefinePlugin(definePluginProperties),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: true
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    alias: {
      components: `${PATHS.ABS.SOURCE}/components`,
      config: `${PATHS.ABS.SOURCE}/config`,
      css: `${PATHS.ABS.SOURCE}/css`
    },
    modules: [
      PATHS.ABS.SOURCE,
      PATHS.ABS.NODE_MODULES
    ]
  }
};
