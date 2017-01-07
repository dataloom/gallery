/*
 * @flow
 */

import {
  combineReducers
} from 'redux-immutable';

import organizationsReducer from '../../containers/organizations/OrganizationsReducer';

export default function reduxReducer() {

  return combineReducers({
    orgs: organizationsReducer
  });
}
