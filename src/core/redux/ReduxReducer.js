/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import asyncReducer from '../../containers/async/AsyncReducer';
import catalogReducer from '../../containers/catalog/CatalogReducer';
import createEntitySetReducer from '../../containers/entitysetforms/CreateEntitySetReducer';
import datasetsReducer from '../../containers/datasets/DatasetsReducer';
import edmReducer from '../../containers/edm/EdmReducer';
import entitySetDetailReducer from '../../containers/entitysetdetail/EntitySetDetailReducer';
import organizationsReducer from '../../containers/organizations/reducers/OrganizationsReducer';
import permissionReducer from '../../containers/permissions/PermissionsReducer';
import permissionsSummaryReducer from '../../containers/permissionssummary/PermissionsSummaryReducer';
import principalsReducer from '../../containers/principals/PrincipalsReducer';
// import securableObjectReducer from '../../containers/securableobject/SecurableObjectReducer';
import topUtilizersReducer from '../../containers/toputilizers/TopUtilizersReducer';
import visualizationReducer from '../../containers/visualizations/VisualizationReducer';

import neuronReducer from '../neuron/NeuronReducer';
import routerReducer from '../router/RouterReducer';

export default function reduxReducer() {

  return combineReducers({
    async: asyncReducer,
    catalog: catalogReducer,
    createEntitySet: createEntitySetReducer,
    datasets: datasetsReducer,
    edm: edmReducer,
    entitySetDetail: entitySetDetailReducer,
    neuron: neuronReducer,
    organizations: organizationsReducer,
    permissions: permissionReducer,
    permissionsSummary: permissionsSummaryReducer,
    principals: principalsReducer,
    router: routerReducer,
    // securableObject: securableObjectReducer,
    topUtilizers: topUtilizersReducer,
    visualizations: visualizationReducer
  });
}
