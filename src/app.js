import React from 'react';
import ReactDOM from 'react-dom';

import 'react-bootstrap/dist/react-bootstrap.js';
import { hashHistory } from 'react-router';
import './app.css';
import App from './containers/App/App';
import { makeRoutes } from './routes';

const routes = makeRoutes();

const mountNode = document.querySelector('#app');

ReactDOM.render(
  <App history={hashHistory} routes={routes} />,
  mountNode
);
