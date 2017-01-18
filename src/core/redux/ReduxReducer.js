/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import catalogReducer from '../../containers/catalog/CatalogReducer';
import entitySetDetailReducer from '../../containers/entitysetdetail/EntitySetDetailReducer';
import ndataReducer from '../../containers/ndata/NdataReducer';
import organizationsReducer from '../../containers/organizations/reducers/OrganizationsReducer';

export default function reduxReducer() {

  return combineReducers({
    catalog: catalogReducer,
    entitySetDetail: entitySetDetailReducer,
    normalizedData: ndataReducer,
    organizations: organizationsReducer
  });
}
