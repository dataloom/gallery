/* @flow */
import { Map, fromJS } from 'immutable';

import * as actionTypes from './PermissionsActionTypes';

export const LOADING_ERROR = Symbol('loading error');

const INITIAL_STATE:Map<*, *> = fromJS({
  authorizations: {}
});

export default function reducer(state:Immutable.Map<*, *> = INITIAL_STATE, action:Object) {
  let authorizations;

  switch (action.type) {
    case actionTypes.CHECK_AUTHORIZATION_REJECT:
       authorizations = state.get('authorizations');
      action.accessChecks.forEach(accessCheck => {
        authorizations.setIn(accessCheck.aclKeys.concat('permissions'), LOADING_ERROR)
      });
      return state.set('authorizations', authorizations);

    case actionTypes.ENTITY_SET_AUTHORIZATION_RESOLVE:
      authorizations = state.get('authorizations');
      action.authorizations.forEach(authorization => {
        authorizations.setIn(authorization.aclKeys.concat('permissions'), authorization.permissions)
      });
      return state.set('authorizations', authorizations);

    default:
      return state;
  }
}
