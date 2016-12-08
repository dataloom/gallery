import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Loom from 'loom-data';
import AuthService from '../../utils/AuthService';
import { Container } from './Container.js';
import { Catalog } from './Catalog/Catalog';
import { Login } from './Login/Login';
import { Home } from './Home/Home';
import { Settings } from './Settings/Settings';
import { Visualize } from './Visualizations/Visualize';
import AuthConsts from '../../utils/Consts/AuthConsts';
import PageConsts from '../../utils/Consts/PageConsts';
import EnvConsts from '../../utils/Consts/EnvConsts';
import UserRoleConsts from '../../utils/Consts/UserRoleConsts';
import StringConsts from '../../utils/Consts/StringConsts';


declare var __LOCAL__;

const auth = new AuthService(AuthConsts.AUTH0_CLIENT_ID, AuthConsts.AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: `/${PageConsts.LOGIN}` });
  }
  else {
    const authToken = auth.getToken();
    const host = window.location.host;
    const hostName = (host.startsWith('www.')) ? host.substring('www.'.length) : host;
    const baseUrl = (__LOCAL__) ? EnvConsts.LOCAL : `https://api.${hostName}`;
    Loom.configure({ baseUrl, authToken });
  }
};

const requireAdmin = (nextState, replace) => {
  requireAuth(nextState, replace);
  if (!auth.getProfile().roles.includes(UserRoleConsts.ADMIN)) {
    replace({ pathname: `/${PageConsts.HOME}` });
  }
};

const isAdmin = () => {
  return (auth.loggedIn() && auth.getProfile().roles.includes(UserRoleConsts.ADMIN));
};

const getName = () => {
  return (auth.loggedIn()) ? auth.getProfile().given_name : StringConsts.EMPTY;
};

const getProfileStatus = () => {
  return {
    isAdmin: isAdmin(),
    name: getName()
  };
};

export const makeMainRoutes = () => {
  return (
    <Route path={'/'} component={Container} auth={auth} profileFn={getProfileStatus}>
      <IndexRedirect to={`/${PageConsts.HOME}`} />
      <Route path={PageConsts.HOME} component={Home} onEnter={requireAuth} />
      <Route path={PageConsts.CATALOG} component={Catalog} onEnter={requireAuth} />
      <Route path={PageConsts.SETTINGS} component={Settings} onEnter={requireAdmin} />
      <Route path={PageConsts.VISUALIZE} component={Visualize} onEnter={requireAuth} />
      <Route path={PageConsts.LOGIN} component={Login} />
      <Route path={'access_token=:token'} component={Login} /> {/* to prevent router errors*/}
    </Route>
  );
};

export default makeMainRoutes;
