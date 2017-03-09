import WEBPACK_CONFIG from '../webpack/webpack.config.test';

const TESTS_PATH = 'src/**/*.test.js';
const CHAI_CONFIG_PATH = 'config/chai/*.js';

import {
  testProfile
} from '../env';

function getProfileOptions(profile) {

  let autoWatch;
  let browsers;

  switch(profile) {
    case 'dev':
      autoWatch = true;
      browsers = ['Chrome'];
      break;

    default:
      autoWatch = false;
      browsers = ['PhantomJS'];
  }

  return {
    autoWatch,
    browsers
  }
}

export default function(config) {

  const { autoWatch, browsers } = getProfileOptions(testProfile);

  config.set({

    /*
     * enables or disables watching files so to execute the tests whenever a file changes
     */
    autoWatch,

    /*
     * continuous integration mode
     * if true, Karma will start and capture all configured browsers, run the tests, and then exit with an exit code of
     * 0 or 1; 0 if all tests passed, 1 if any tests failed
     */
    singleRun: !autoWatch,

    /*
     * a list of browsers to launch and capture
     *
     * http://karma-runner.github.io/1.0/config/browsers.html
     * https://npmjs.org/browse/keyword/karma-launcher
     */
    browsers,

    // root path that will be used to resolve all relative paths defined in "files" and "exclude"
    basePath: '../..',

    /*
     * a list of test frameworks to use
     *
     * https://npmjs.org/browse/keyword/karma-adapter
     */
    frameworks: ['mocha', 'chai'],

    /*
     * a list of files to load in the browser
     *
     * http://karma-runner.github.io/1.0/config/files.html
     */
    files: [
      require.resolve('babel-polyfill'),
      CHAI_CONFIG_PATH,
      TESTS_PATH
    ],

    /*
     * the keys in the "preprocessors" config filter the matching files specified in the "files" config for processing
     * before serving them to the browser
     *
     * http://karma-runner.github.io/1.0/config/preprocessors.html
     * https://npmjs.org/browse/keyword/karma-preprocessor
     */
    preprocessors: {
      [require.resolve('babel-polyfill')]: ['webpack'],
      [CHAI_CONFIG_PATH]: ['webpack'],
      [TESTS_PATH]: ['webpack', 'sourcemap']
    },

    /*
     * https://github.com/webpack/karma-webpack
     */
    webpack: WEBPACK_CONFIG,

    /*
     * https://webpack.github.io/docs/webpack-dev-middleware.html
     */
    webpackMiddleware: {
      noInfo: true
    },

    /*
     * a list of reporters to use for test results
     *
     * https://npmjs.org/browse/keyword/karma-reporter
     */
    reporters: ['mocha'],

    /*
     * possible values:
     *   config.LOG_DISABLE
     *   config.LOG_ERROR
     *   config.LOG_WARN
     *   config.LOG_INFO
     *   config.LOG_DEBUG
     */
    logLevel: config.LOG_INFO
  });
}
