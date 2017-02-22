import 'babel-polyfill';
import 'rxjs';

import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { Router } from 'react-router';

import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';

import './core/styles/global/index.css';

import { makeMainRoutes } from './views/Main/routes';

const reduxStore = initializeReduxStore();
const routerHistory = initializeRouterHistory(reduxStore);

ReactDOM.render(
  <Provider store={reduxStore}>
    <Router history={routerHistory}>
      { makeMainRoutes() }
    </Router>
  </Provider>,
  document.getElementById('app')
);
