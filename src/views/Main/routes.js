import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';
import Loom from 'loom-data';
import AuthService from '../../utils/AuthService';
import { Container } from './Container';
import { Schemas } from './Schemas/Schemas';
import { Login } from './Login/Login';
import { Home } from './Home/Home';
import { Settings } from './Settings/Settings';
import { Visualize } from './Visualizations/Visualize';
import CatalogComponent from '../../containers/catalog/CatalogComponent';
import EntitySetDetailComponent from '../../containers/entitysetdetail/EntitySetDetailComponent';
import PageConsts from '../../utils/Consts/PageConsts';
import EnvConsts from '../../utils/Consts/EnvConsts';
import UserRoleConsts from '../../utils/Consts/UserRoleConsts';
import StringConsts from '../../utils/Consts/StringConsts';

import OrganizationsComponent from '../../containers/organizations/components/OrganizationsComponent';
import OrganizationDetailsComponent from '../../containers/organizations/components/OrganizationDetailsComponent';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__;
declare var __AUTH0_DOMAIN__;
declare var __DEV__;

const auth = new AuthService(__AUTH0_CLIENT_ID__, __AUTH0_DOMAIN__, __DEV__);

// onEnter callback to validate authentication in private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: `/${PageConsts.LOGIN}` });
  }
  else {
    const authToken = auth.getToken();
    const host = window.location.host;
    const hostName = (host.startsWith('www.')) ? host.substring('www.'.length) : host;
    const baseUrl = (__DEV__) ? EnvConsts.LOCAL : `https://api.${hostName}`;
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

  let displayName;
  if (auth.loggedIn()) {
    const profile = auth.getProfile();

    if (profile.hasOwnProperty('given_name')) {
      displayName = profile.given_name;
    }
    else if (profile.hasOwnProperty('name')) {
      displayName = profile.name;
    }
    else if (profile.hasOwnProperty('nickname')) {
      displayName = profile.nickname;
    }
    else if (profile.hasOwnProperty('email')) {
      displayName = profile.email;
    }
    else {
      displayName = StringConsts.EMPTY;
    }
  }

  return displayName;
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
      <Route path={PageConsts.CATALOG} component={CatalogComponent} onEnter={requireAuth} />
      <Route path={'entitysets/:id'} component={EntitySetDetailComponent} onEnter={requireAuth} />
      <Route path={PageConsts.DATA_MODEL} component={Schemas} onEnter={requireAuth} />
      <Route path={PageConsts.SETTINGS} component={Settings} onEnter={requireAdmin} />
      <Route path={PageConsts.VISUALIZE} component={Visualize} onEnter={requireAuth} />
      <Route path={PageConsts.ORG} component={OrganizationsComponent} onEnter={requireAuth}>
        <Route path=":orgId" component={OrganizationDetailsComponent} onEnter={requireAuth} />
      </Route>
      <Route path={PageConsts.LOGIN} component={Login} />
      <Route path={'access_token=:token'} component={Login} /> {/* to prevent router errors*/}
    </Route>
  );
};

export default makeMainRoutes;
