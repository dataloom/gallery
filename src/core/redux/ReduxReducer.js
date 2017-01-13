/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import organizationsReducer from '../../containers/Organizations/OrganizationsReducer';
import catalogReducer from '../../containers/catalog/CatalogReducer';
import ndataReducer from '../../containers/ndata/NdataReducer';

export default function reduxReducer() {

  return combineReducers({
    catalog: catalogReducer,
    normalizedData: ndataReducer,
    orgs: organizationsReducer
  });
}
