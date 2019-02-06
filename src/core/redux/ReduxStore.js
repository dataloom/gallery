/*
 * @flow
 */

import Immutable from 'immutable';
import createSagaMiddleware from 'redux-saga';

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
import sagas from './Sagas';


export default function initializeReduxStore() :Object {

  const sagaMiddleware = createSagaMiddleware();

  const reduxMiddlewares = [
    createEpicMiddleware(reduxEpic()),
    sagaMiddleware,
    routerMiddleware(hashHistory)
  ];

  const reduxEnhancers = [
    applyMiddleware(...reduxMiddlewares)
  ];

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      maxAge: 100
    })
    : compose;
  /* eslint-enable */

  const reduxStore = createStore(
    reduxReducer(),
    Immutable.Map(),
    composeEnhancers(...reduxEnhancers)
  );

  sagaMiddleware.run(sagas);

  return reduxStore;
}
