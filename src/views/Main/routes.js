import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import AuthService from '../../utils/AuthService';
import { Container } from './Container.js';
import { Catalog } from './Catalog/Catalog';
import { Login } from './Login/Login';
import Consts from '../../utils/AppConsts';

const auth = new AuthService(Consts.AUTH0_CLIENT_ID, Consts.AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' });
  }
};

export const makeMainRoutes = () => (
  <Route path={'/'} component={Container} auth={auth}>
    <IndexRedirect to={'/catalog'} />
    <Route path={'catalog'} component={Catalog} onEnter={requireAuth} />
    <Route path={'login'} component={Login} />
    <Route path={'access_token=:token'} component={Login} /> {/* to prevent router errors*/}
  </Route>
);

export default makeMainRoutes;
