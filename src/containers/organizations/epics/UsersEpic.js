/*
 * @flow
 */

import {
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

function addRoleToUser(action :Action) :Observable<Action> {

  const {
    userId,
    role
  } = action;

  return Observable
    .from(PrincipalsApi.addRoleToUser(userId, role))
    .mergeMap(() => {
      return Observable.of(
        UsersActionFactory.addRoleToUserSuccess(userId, role)
      );
    })
    .catch(() => {
      return Observable.of(
        UsersActionFactory.addRoleToUserFailure()
      );
    });
}

function addRoleToUserEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(UsersActionTypes.ADD_ROLE_TO_USER_REQUEST)
    .mergeMap(addRoleToUser);
}


function removeRoleFromUser(action :Action) :Observable<Action> {

  const {
    userId,
    role
  } = action;

  return Observable
    .from(PrincipalsApi.removeRoleFromUser(userId, role))
    .mergeMap(() => {
      return Observable.of(
        UsersActionFactory.removeRoleFromUserSuccess(userId, role)
      );
    })
    .catch(() => {
      return Observable.of(
        UsersActionFactory.removeRoleFromUserFailure()
      );
    });
}

function removeRoleFromUserEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(UsersActionTypes.REMOVE_ROLE_FROM_USER_REQUEST)
    .mergeMap(removeRoleFromUser);
}

export default combineEpics(
  fetchAllUsersEpic,
  addRoleToUserEpic,
  removeRoleFromUserEpic
);
