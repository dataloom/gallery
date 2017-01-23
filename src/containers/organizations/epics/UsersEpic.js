/*
 * @flow
 */

import {
  Types,
  PrincipalsApi
} from 'loom-data';

import {
  combineEpics
} from 'redux-observable';

import {
  Observable
} from 'rxjs';

import * as UsersActionTypes from '../actions/UsersActionTypes';
import * as UsersActionFactory from '../actions/UsersActionFactory';

const {
  PrincipalTypes
} = Types;

/*
 * TODO: need a pattern for chaining API calls in the Observables world
 */

function fetchAllUsers() :Observable<Action> {

  return Observable
    .from(PrincipalsApi.getAllUsers())
    .mergeMap((users :Object[]) => {
      return Observable.of(
        UsersActionFactory.fetchAllUsersSuccess(users)
      );
    })
    .catch(() => {
      return Observable.of(
        UsersActionFactory.fetchAllUsersFailure()
      );
    });
}

function fetchAllUsersEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(UsersActionTypes.FETCH_ALL_USERS_REQUEST)
    .mergeMap(fetchAllUsers);
}

export default combineEpics(
  fetchAllUsersEpic
);
