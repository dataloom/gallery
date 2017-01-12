/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import organizationsReducer from '../../containers/organizations/OrganizationsReducer';
import catalogReducer from '../../containers/catalog/CatalogReducer';

export default function reduxReducer() {

  return combineReducers({
    orgs: organizationsReducer,
    catalog: catalogReducer
  });
}
