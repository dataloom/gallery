/*
 * @flow
 */

import Immutable from 'immutable';

import * as UsersActionTypes from '../actions/UsersActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  users: {}
});

export default function usersReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    case UsersActionTypes.FETCH_ALL_USERS_SUCCESS:
      return state.set('users', Immutable.fromJS(action.users));

    default:
      return state;
  }
}
