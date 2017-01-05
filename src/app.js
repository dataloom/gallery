import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

import {
  Provider
} from 'react-redux';

import {
  Router,
  hashHistory
} from 'react-router';

import initializeReduxStore from './core/redux/ReduxStore';
import makeRoutes from './routes';

const routes = makeRoutes();
const reduxStore = initializeReduxStore();

ReactDOM.render(
  <Provider store={reduxStore}>
    <Router history={hashHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
