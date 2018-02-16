/* eslint-disable no-underscore-dangle, import/no-extraneous-dependencies, import/extensions */

import APP_PATHS from '../app.paths.js';

import {
  BABEL_LOADER,
  CSS_LOADER,
  CSS_LOADER_GLOBALS,
  JSON_LOADER,
  MEDIA_FILE_LOADER,
  MEDIA_URL_LOADER
} from './loaders'

import {
  BANNER_PLUGIN,
  DEFINE_PLUGIN,
  EXTRACT_TEXT_PLUGIN
} from './plugins'

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
    extensions: ['.js', '.css'],
    modules: [
      APP_PATHS.ABS.SOURCE,
      APP_PATHS.ABS.NODE
    ]
  },
  node: {
    net: 'empty'
  }
};
