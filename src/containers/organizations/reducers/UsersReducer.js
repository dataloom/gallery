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

    case UsersActionTypes.ADD_ROLE_TO_USER_SUCCESS: {

      const userId :string = action.userId;
      const role :string = action.role;
      const user :Immutable.Map = state.getIn(['users', userId], Immutable.Map());
      if (user.isEmpty()) {
        return state;
      }

      const currentRoles :Immutable.List = user.get('roles', Immutable.List());
      const newRoles = currentRoles.push(role);
      const newUser = user.set('roles', newRoles);
      return state.setIn(['users', userId], newUser);
    }

    case UsersActionTypes.REMOVE_ROLE_FROM_USER_SUCCESS: {

      const userId :string = action.userId;
      const user :Immutable.Map = state.getIn(['users', userId], Immutable.Map());
      if (user.isEmpty()) {
        return state;
      }

      const currentRoles :Immutable.List = user.get('roles', Immutable.List());
      const index :number = currentRoles.findIndex((role) => {
        return role === action.role;
      });

      const newRoles = currentRoles.delete(index);
      const newUser = user.set('roles', newRoles);
      return state.setIn(['users', userId], newUser);
    }

    default:
      return state;
  }
}
