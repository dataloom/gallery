import React from 'react';
import ReactDOM from 'react-dom';

import { hashHistory } from 'react-router';
import App from './containers/App/App';
import { makeRoutes } from './routes';

const routes = makeRoutes();

const mountNode = document.querySelector('#app');

ReactDOM.render(
  <App history={hashHistory} routes={routes} />,
  mountNode
);
