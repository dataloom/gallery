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
import principalsReducer from '../../containers/principals/PrincipalsReducer';
import securableObjectReducer from '../../containers/securableobject/SecurableObjectReducer';

import neuronReducer from '../neuron/NeuronReducer';
import routerReducer from '../router/RouterReducer';

export default function reduxReducer() {

  return combineReducers({
    async: asyncReducer,
    catalog: catalogReducer,
    createEntitySet: createEntitySetReducer,
    datasets: datasetsReducer,
    entitySetDetail: entitySetDetailReducer,
    neuron: neuronReducer,
    normalizedData: edmReducer,
    organizations: organizationsReducer,
    permissions: permissionReducer,
    principals: principalsReducer,
    router: routerReducer,
    securableObject: securableObjectReducer
  });
}
