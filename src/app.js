import 'babel-polyfill';
// Needed by redux-observable
import 'rxjs';

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
import makeRoutes from './core/router/Routes';
import './core/styles/global/index.css';

const reduxStore = initializeReduxStore();
const routes = makeRoutes();

ReactDOM.render(
  <Provider store={reduxStore}>
    <Router history={hashHistory} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
