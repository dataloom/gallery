/*
 * @flow
 */

import Immutable from 'immutable';

import {
  DataModels,
  Types
} from 'loom-data';

import * as PrincipalsActionTypes from '../principals/PrincipalsActionTypes';

const {
  Principal,
  PrincipalBuilder
} = DataModels;

const {
  PrincipalTypes
} = Types;


const INITIAL_STATE :Immutable.Map = Immutable.fromJS({
  users: Immutable.Map()
});

export default function principalsReducer(state :Immutable.Map = INITIAL_STATE, action :Object) :Immutable.Map {

  switch (action.type) {

    case PrincipalsActionTypes.FETCH_USERS_SUCCESS: {

      // TODO: this needs to be implemented in PrincipalsEpic
      return state;
    }

    case PrincipalsActionTypes.FETCH_USER_SUCCESS: {

      const fetchedUser :Immutable.Map = Immutable.Map().withMutations((map :Immutable.Map) => {
        const user = Immutable.fromJS(action.user);
        map.set(user.get('user_id'), user);
      });

      const currentUsers :Immutable.Map = state.get('users');
      const updatedUsers :Immutable.Map = currentUsers.mergeDeep(fetchedUser);

      return state.set('users', updatedUsers);
    }

    case PrincipalsActionTypes.SEARCH_ALL_USERS_SUCCESS: {

      const usersSearchResults :Immutable.Map = Immutable.Map().withMutations((map :Immutable.Map) => {
        Immutable.fromJS(action.searchResults).forEach((user :Immutable.Map) => {
          map.set(user.get('user_id'), user);
        });
      });

      const currentUsers :Immutable.Map = state.get('users');
      const updatedUsers :Immutable.Map = currentUsers.mergeDeep(usersSearchResults);

      return state.set('users', updatedUsers);
    }

    default:
      return state;
  }
}
