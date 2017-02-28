import React from 'react';
import { IndexRedirect, IndexRoute, Route } from 'react-router';
import Loom from 'loom-data';
import AuthService from '../../utils/AuthService';
import Container from './Container';
import { DataModel } from './Schemas/DataModel';
import Login from './Login/Login';
import HomeComponent from '../../containers/home/HomeComponent';
import { Settings } from './Settings/Settings';
import { Visualize } from './Visualizations/Visualize';
import { Link } from './Link/Link';
import CatalogComponent from '../../containers/catalog/CatalogComponent';
import EntitySetDataSearch from '../../containers/entitysetsearch/EntitySetDataSearch';
import AdvancedDataSearch from '../../containers/entitysetsearch/AdvancedDataSearch';
import EntitySetDetailComponent from '../../containers/entitysetdetail/EntitySetDetailComponent';
import DatasetsComponent from '../../containers/datasets/DatasetsComponent';
import PageConsts from '../../utils/Consts/PageConsts';
import EnvConsts from '../../utils/Consts/EnvConsts';
import { ADMIN } from '../../utils/Consts/UserRoleConsts';
import { configure as edmApiConfigure } from '../../containers/Api';
import { getDisplayName } from '../../containers/principals/PrincipalUtils';

import OrganizationsContainerComponent from '../../containers/organizations/components/OrganizationsContainerComponent';
import OrganizationDetailsComponent from '../../containers/organizations/components/OrganizationDetailsComponent';
import OrganizationsListComponent from '../../containers/organizations/components/OrganizationsListComponent';

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
    // TODO: Remove once loom-data-js upgrades
    edmApiConfigure(baseUrl, authToken);
  }
};

const requireAdmin = (nextState, replace) => {
  requireAuth(nextState, replace);
  if (!auth.getProfile().roles.includes(ADMIN)) {
    replace({ pathname: `/${PageConsts.HOME}` });
  }
};

const isAdmin = () => {
  return (auth.loggedIn() && auth.getProfile().hasOwnProperty('roles') && auth.getProfile().roles.includes(ADMIN));
};

const getName = () => {
  if (auth.loggedIn()) {
    return getDisplayName(auth.getProfile());
  } else {
    return null;
  }
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
      <Route path={PageConsts.HOME} component={HomeComponent} onEnter={requireAuth} />
      <Route path={PageConsts.CATALOG} component={CatalogComponent} onEnter={requireAuth} />
      <Route path={`${PageConsts.SEARCH}/:entitySetId`} component={EntitySetDataSearch} onEnter={requireAuth} />
      <Route path={`${PageConsts.ADVANCED_SEARCH}/:entitySetId`} component={AdvancedDataSearch} onEnter={requireAuth} />
      <Route path={'entitysets/:id'} component={EntitySetDetailComponent} onEnter={requireAuth} />
      <Route path={PageConsts.DATA_MODEL} component={DataModel} onEnter={requireAuth} />
      <Route path={PageConsts.SETTINGS} component={Settings} onEnter={requireAdmin} />
      <Route path={PageConsts.VISUALIZE} component={Visualize} onEnter={requireAuth} />
      <Route path={PageConsts.DATASETS} component={DatasetsComponent} onEnter={requireAuth} />
      <Route path={'orgs'} component={OrganizationsContainerComponent} onEnter={requireAuth}>
        <IndexRoute component={OrganizationsListComponent} />
        <Route path=":orgId" component={OrganizationDetailsComponent} onEnter={requireAuth} />
      </Route>
      <Route path={PageConsts.LOGIN} component={Login} />
      <Route path={'access_token=:token'} component={Login} /> {/* to prevent router errors*/}
      <Route path={PageConsts.LINK} component={Link} onEnter={requireAuth} />
    </Route>
  );
};

export default makeMainRoutes;
