/*
 * @flow
 */

import Immutable from 'immutable';

import * as PrincipalsActionTypes from '../principals/PrincipalsActionTypes';

const INITIAL_STATE :Map<> = Immutable.fromJS({
  users: Immutable.Map()
});

export default function principalsReducer(state :Map<> = INITIAL_STATE, action :Object) :Map<> {

  switch (action.type) {

    case PrincipalsActionTypes.FETCH_USER_SUCCESS: {

      const fetchedUser :Map<> = Immutable.fromJS(action.user);
      return state.setIn(['users', fetchedUser.get('user_id')], fetchedUser);
    }

    case PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_SUCCESS: {

      const usersSearchResults :Immutable.Map = Immutable.Map().withMutations((map :Immutable.Map) => {
        Immutable.fromJS(action.searchResults).forEach((user :Immutable.Map) => {
          map.set(user.get('user_id'), user);
        });
      });

      const currentUsers :Immutable.Map = state.get('users');
      // TODO: is mergeDeep() the right operation to do here?
      const updatedUsers :Immutable.Map = currentUsers.mergeDeep(usersSearchResults);

      return state.set('users', updatedUsers);
    }

    default:
      return state;
  }
}
