/*
 * @flow
 */

import { combineReducers } from 'redux-immutable';

import catalogReducer from '../../containers/catalog/CatalogReducer';
import entitySetDetailReducer from '../../containers/entitysetdetail/EntitySetDetailReducer';
import edmReducer from '../../containers/edm/EdmReducer';
import organizationsReducer from '../../containers/organizations/reducers/OrganizationsReducer';
import createEntitySetReducer from '../../containers/entitysetforms/CreateEntitySetReducer';
import securableObjectReducer from '../../containers/securableobject/SecurableObjectReducer';
import permissionReducer from '../../containers/permissions/PermissionsReducer';
import principalsReducer from '../../containers/principals/PrincipalsReducer';
import asyncReducer from '../../containers/async/AsyncReducer';
import datasetsReducer from '../../containers/datasets/DatasetsReducer';
import routerReducer from '../router/RouterReducer';

export default function reduxReducer() {

  return combineReducers({
    catalog: catalogReducer,
    entitySetDetail: entitySetDetailReducer,
    normalizedData: edmReducer,
    organizations: organizationsReducer,
    createEntitySet: createEntitySetReducer,
    securableObject: securableObjectReducer,
    permissions: permissionReducer,
    principals: principalsReducer,
    async: asyncReducer,
    datasets: datasetsReducer,
    router: routerReducer
  });
}
