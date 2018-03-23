import Immutable from 'immutable';

import * as PrincipalsActionTypes from '../principals/PrincipalsActionTypes';

const INITIAL_STATE = Immutable.fromJS({
  users: Immutable.Map()
});

export default function principalsReducer(state = INITIAL_STATE, action) {

  switch (action.type) {

    case PrincipalsActionTypes.FETCH_USER_SUCCESS: {

      const fetchedUser = Immutable.fromJS(action.user);
      return state.setIn(['users', fetchedUser.get('user_id')], fetchedUser);
    }

    case PrincipalsActionTypes.SEARCH_ALL_USERS_SUCCESS: {

      const usersSearchResults = Immutable.Map().withMutations((map) => {
        Immutable.fromJS(action.searchResults).forEach((user) => {
          map.set(user.get('user_id'), user);
        });
      });

      const currentUsers = state.get('users');
      // TODO: is mergeDeep() the right operation to do here?
      const updatedUsers = currentUsers.mergeDeep(usersSearchResults);
      return state.set('users', updatedUsers);
    }

    default:
      return state;
  }
}
