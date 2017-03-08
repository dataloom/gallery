// Karma configuration

const TESTS_PATH = 'src/**/*.test.js';
const CHAI_CONFIG_PATH = 'config/chai/*.js';

const ENV = process.env.TEST;

module.exports = function(config) {
  let autoWatch = false;
  let browsers = ['PhantomJS'];

  if (ENV === 'dev') {
    autoWatch = true;
    browsers = ['Chrome'];
  }

  config.set({
    autoWatch,
    singleRun: !autoWatch,
    browsers,

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../..',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      require.resolve('babel-polyfill'),
      CHAI_CONFIG_PATH,
      TESTS_PATH
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      [require.resolve('babel-polyfill')]: ['webpack'],
      [CHAI_CONFIG_PATH]: ['webpack'],
      [TESTS_PATH]: ['webpack', 'sourcemap']
    },
    webpack: require('../webpack/webpack.config.test'),

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


    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
