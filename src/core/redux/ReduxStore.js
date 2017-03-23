/*
 * @flow
 */

import Immutable from 'immutable';

import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';

import {
  applyMiddleware,
  compose,
  createStore
} from 'redux';

import reduxReducer from './ReduxReducer';
import reduxEpic from './ReduxEpic';

export default function initializeReduxStore() :Object {

  const reduxMiddlewares = [
    createEpicMiddleware(reduxEpic()),
    routerMiddleware(hashHistory)
  ];

  const reduxEnhancers = [
    applyMiddleware(...reduxMiddlewares)
  ];

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  /* eslint-enable */

  const reduxStore = createStore(
    reduxReducer(),
    Immutable.Map(),
    composeEnhancers(...reduxEnhancers)
  );

  return reduxStore;
}
