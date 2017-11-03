/*
 * @flow
 */

import Immutable from 'immutable';

import * as actionTypes from './AppActionTypes';

export const INITIAL_STATE :Map<> = Immutable.fromJS({
  apps: Immutable.List(),
  errorMessage: '',
  allOrganizations: Immutable.List(),
  ownedOrganizations: Immutable.List()
});

export default function reducer(state :Map<> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case actionTypes.GET_APPS_SUCCESS:
      return state
        .set('apps', Immutable.fromJS(action.apps))
        .set('errorMessage', '');

    case actionTypes.GET_APPS_FAILURE:
      return state
        .set('apps', Immutable.List())
        .set('errorMessage', action.errorMessage);

    case actionTypes.INSTALL_APP_FAILURE:
      return state.set('errorMessage', action.errorMessage);

    default:
      return state;
  }
}
