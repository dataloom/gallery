/*
 * @flow
 */

const ENVIRONMENTS = {
  LOCAL: 'local',
  PROD: 'production',
  STG: 'staging',
  TEST: 'testing'
};

const NODE_ENV = process.env.NODE_ENV || ENVIRONMENTS.LOCAL;

module.exports = {
  __LOCAL__: NODE_ENV === ENVIRONMENTS.LOCAL,
  __PROD__: NODE_ENV === ENVIRONMENTS.PROD,
  __STG__: NODE_ENV === ENVIRONMENTS.STG,
  __TEST__: NODE_ENV === ENVIRONMENTS.TEST
};
