/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import asyncReducer from '../../containers/async/AsyncReducer';
import catalogReducer from '../../containers/catalog/CatalogReducer';
import createEntitySetReducer from '../../containers/entitysetforms/CreateEntitySetReducer';
import datasetsReducer from '../../containers/datasets/DatasetsReducer';
import edmReducer from '../../containers/edm/EdmReducer';
import entitySetDetailReducer from '../../containers/entitysetdetail/EntitySetDetailReducer';
import homeReducer from '../../containers/home/HomeReducer';
import organizationsReducer from '../../containers/organizations/reducers/OrganizationsReducer';
import permissionsPanelReducer from '../../containers/permissionspanel/PermissionsPanelReducer';
import permissionReducer from '../../containers/permissions/PermissionsReducer';
import permissionsSummaryReducer from '../../containers/permissionssummary/PermissionsSummaryReducer';
import principalsReducer from '../../containers/principals/PrincipalsReducer';
import profileReducer from '../../containers/profile/ProfileReducer';
// import securableObjectReducer from '../../containers/securableobject/SecurableObjectReducer';
import topUtilizersReducer from '../../containers/toputilizers/TopUtilizersReducer';
import visualizationReducer from '../../containers/visualizations/VisualizationReducer';

import neuronReducer from '../neuron/NeuronReducer';
import routerReducer from '../router/RouterReducer';

export default function reduxReducer() {

  return combineReducers({
    app: appReducer,
    async: asyncReducer,
    catalog: catalogReducer,
    createEntitySet: createEntitySetReducer,
    datasets: datasetsReducer,
    edm: edmReducer,
    entitySetDetail: entitySetDetailReducer,
    home: homeReducer,
    neuron: neuronReducer,
    organizations: organizationsReducer,
    permissionsPanel: permissionsPanelReducer,
    permissions: permissionReducer,
    permissionsSummary: permissionsSummaryReducer,
    principals: principalsReducer,
    profile: profileReducer,
    router: routerReducer,
    // securableObject: securableObjectReducer,
    topUtilizers: topUtilizersReducer,
    visualizations: visualizationReducer
  });
}
