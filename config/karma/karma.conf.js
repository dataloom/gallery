/* Webpack Config */
const APP_PATHS = require('../app.paths.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

// Karma configuration

const TEST_GLOB_PATH = '../../src/**/*.test.js';

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      TEST_GLOB_PATH
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      [TEST_GLOB_PATH]: ['webpack']
    },
    webpack: {
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
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
