/* @flow */
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import values from 'lodash/values';

import { PrincipalsApi } from 'loom-data';

import { createPrincipalReference } from './PrincipalsStorage';
import AsyncActionFactory from '../async/AsyncActionFactory';

import * as PrincipalsActionTypes from './PrincipalsActionTypes';
import * as PrincipalsActionFactory from './PrincipalsActionFactory';

function loadPrincipal(id :string) {
  const reference = createPrincipalReference(id);
  return Observable.merge(
    Observable.of(AsyncActionFactory.asyncReferenceLoading(reference)),
    Observable.from(PrincipalsApi.getUser(id))
      .map(Immutable.fromJS)
      .map(principal => {
        return AsyncActionFactory.updateAsyncReference(reference, principal);
      })
      .catch(error => AsyncActionFactory.asyncReferenceError(reference, 'Failed to load principal')));
}

function loadPrincipalEpic(action$) {
  return action$.ofType(PrincipalsActionTypes.LOAD_PRINCIPAL_DETAILS)
    .pluck('id')
    .mergeMap(loadPrincipal)
}

/*
 * TODO: I don't understand the "reference" pattern, so I don't want to touch anything above so not to break anything,
 * but PrincipalsEpic seems like the correct place to put the rest of the PrincipalsApi-related actions. I need to
 * better understand how these references work to figure out whether or not to continue with that pattern.
 */

function fetchAllUsersEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PrincipalsActionTypes.FETCH_ALL_USERS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(PrincipalsApi.getAllUsers())
        .mergeMap((users :Object[]) => {
          return Observable.of(
            PrincipalsActionFactory.fetchAllUsersSuccess(users)
          );
        })
        .catch(() => {
          return Observable.of(
            PrincipalsActionFactory.fetchAllUsersFailure()
          );
        });
    });
}

function fetchUsersEpic(action$ :Observable<Action>) :Observable<Action> {

  /*
   * TODO: figure out how to utilize fetchUserEpic() instead of duplicating that work here
   * TODO: figure out how to dispatch FETCH_USERS_SUCCESS and FETCH_USERS_FAILURE
   * TODO: at the moment, there's no endpoint to fetch specific users, only to fetch all users. to avoid having to
   * fetch all users, we resolve to making multiple single-user fetch requests until there's a bulk endpoint.
   */
  return action$
    .ofType(PrincipalsActionTypes.FETCH_USERS_REQUEST)
    .mergeMap((action :Action) => {

      const requests = action.userIds.map((userId) => {
        return Observable
          .from(PrincipalsApi.getUser(userId))
          .mergeMap((user :Object) => {
            return Observable.of(
              PrincipalsActionFactory.fetchUserSuccess(user)
            );
          })
          .catch(() => {
            return Observable.of(
              PrincipalsActionFactory.fetchUserFailure(userId)
            );
          });
      });

      return Observable.concat(...requests);
    });
}

function fetchUserEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PrincipalsActionTypes.FETCH_USER_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(PrincipalsApi.getUser(action.userId))
        .mergeMap((user :Object) => {
          return Observable.of(
            PrincipalsActionFactory.fetchUserSuccess(user)
          );
        })
        .catch(() => {
          return Observable.of(
            PrincipalsActionFactory.fetchUserFailure(action.userId)
          );
        });
    });
}

function searchAllUsersByEmailEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(PrincipalsApi.searchAllUsersByEmail(action.searchQuery))
        .mergeMap((searchResults :Object[]) => {
          return Observable.of(
            PrincipalsActionFactory.searchAllUsersByEmailSuccess(searchResults)
          );
        })
        .catch(() => {
          return Observable.of(
            PrincipalsActionFactory.searchAllUsersByEmailFailure()
          );
        });
    });
}

export default combineEpics(
  loadPrincipalEpic,
  fetchAllUsersEpic,
  fetchUsersEpic,
  fetchUserEpic,
  searchAllUsersByEmailEpic
);
