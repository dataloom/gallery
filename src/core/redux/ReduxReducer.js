/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import catalogReducer from '../../containers/catalog/CatalogReducer';
import entitySetDetailReducer from '../../containers/entitysetdetail/EntitySetDetailReducer';
import edmReducer from '../../containers/edm/EdmReducer';
import organizationsReducer from '../../containers/organizations/reducers/OrganizationsReducer';
import createEntitySetReducer from '../../containers/entitysetforms/CreateEntitySetReducer';

export default function reduxReducer() {

  return combineReducers({
    catalog: catalogReducer,
    entitySetDetail: entitySetDetailReducer,
    normalizedData: edmReducer,
    organizations: organizationsReducer,
    createEntitySet: createEntitySetReducer
  });
}
