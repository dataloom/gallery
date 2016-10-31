import React from 'react';
import { Route, IndexRedirect } from 'react-router';
import Loom from 'loom-data';
import AuthService from '../../utils/AuthService';
import { Container } from './Container.js';
import { Catalog } from './Catalog/Catalog';
import { Login } from './Login/Login';
import { Home } from './Home/Home';
import Consts from '../../utils/AppConsts';

declare var __LOCAL__;
declare var __STG__;

const auth = new AuthService(Consts.AUTH0_CLIENT_ID, Consts.AUTH0_DOMAIN);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: `/${Consts.LOGIN}` });
  }
  else {
    const authToken = auth.getToken();
    let baseUrl = Consts.PROD;
    if (__LOCAL__) {
      baseUrl = Consts.LOCAL;
    }
    else if (__STG__) {
      baseUrl = Consts.STG;
    }
    Loom.configure({ baseUrl, authToken });
  }
};

export const makeMainRoutes = () => {
  return (
    <Route path={'/'} component={Container} auth={auth}>
      <IndexRedirect to={`/${Consts.HOME}`} />
      <Route path={Consts.HOME} component={Home} onEnter={requireAuth} />
      <Route path={Consts.CATALOG} component={Catalog} onEnter={requireAuth} />
      <Route path={Consts.LOGIN} component={Login} />
      <Route path={'access_token=:token'} component={Login} /> {/* to prevent router errors*/}
    </Route>
  );
};

export default makeMainRoutes;
