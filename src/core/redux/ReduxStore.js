/*
 * @flow
 */

import Immutable from 'immutable';
import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';
import { createEpicMiddleware } from 'redux-observable';

import reduxReducer from './ReduxReducer';
import reduxEpic from './ReduxEpic';

export default function initializeReduxStore() :Object {
  const reduxMiddlewares = [
    createEpicMiddleware(reduxEpic())
  ];

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
