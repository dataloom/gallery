/*
 * @flow
 */

import Immutable from 'immutable';

import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';

import reduxReducer from './ReduxReducer';

export default function initializeReduxStore() :Object {

  const reduxMiddlewares = [];

  const reduxEnhancers = [
    applyMiddleware(...reduxMiddlewares)
  ];

  const reduxStore = createStore(
    reduxReducer(),
    Immutable.Map(),
    compose(...reduxEnhancers)
  );

  return reduxStore;
}
