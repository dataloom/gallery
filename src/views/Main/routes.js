import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Loom from 'loom-data';
import AuthService from '../../utils/AuthService';
import { Container } from './Container.js';
import { Catalog } from './Catalog/Catalog';
import { Login } from './Login/Login';
import { Home } from './Home/Home';
import { Settings } from './Settings/Settings';
import Consts from '../../utils/AppConsts';

declare var __LOCAL__;

const auth = new AuthService(Consts.AUTH0_CLIENT_ID, Consts.AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: `/${Consts.LOGIN}` });
  }
  else {
    const authToken = auth.getToken();
    const baseUrl = (__LOCAL__) ? Consts.LOCAL : `https://api.${window.location.host}`;
    Loom.configure({ baseUrl, authToken });
  }
};

const isAdmin = () => {
  return (auth.loggedIn() && auth.getProfile().roles.includes(Consts.ADMIN));
};

const getName = () => {
  return (auth.loggedIn()) ? auth.getProfile().given_name : Consts.EMPTY;
};

export const makeMainRoutes = () => {
  isAdmin();
  return (
    <Route path={'/'} component={Container} auth={auth} isAdmin={isAdmin()} name={getName()}>
      <IndexRedirect to={`/${Consts.HOME}`} />
      <Route path={Consts.HOME} component={Home} onEnter={requireAuth} />
      <Route path={Consts.CATALOG} component={Catalog} onEnter={requireAuth} />
      <Route path={Consts.LOGIN} component={Login} />
      <Route path={'access_token=:token'} component={Login} /> {/* to prevent router errors*/}
      <Route path={Consts.SETTINGS} component={Settings} />
    </Route>
  );
};

export default makeMainRoutes;
