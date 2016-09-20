/*
 * @flow
 */

const ENVIRONMENTS = {
  DEV: 'development',
  PROD: 'production',
  STG: 'staging',
  TEST: 'testing'
};

const NODE_ENV = process.env.NODE_ENV || ENVIRONMENTS.DEV;

module.exports = {
  __DEV__: NODE_ENV === ENVIRONMENTS.DEV,
  __PROD__: NODE_ENV === ENVIRONMENTS.PROD,
  __STG__: NODE_ENV === ENVIRONMENTS.STG,
  __TEST__: NODE_ENV === ENVIRONMENTS.TEST
};
