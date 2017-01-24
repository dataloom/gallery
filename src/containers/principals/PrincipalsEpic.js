/* @flow */
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';
import { combineEpics } from 'redux-observable';
import values from 'lodash/values';

import { PrincipalsApi } from 'loom-data';

import PrincipalActionTypes from './PrincipalsActionTypes';
import { createPrincipalReference } from './PrincipalsStorage';
import AsyncActionFactory from '../async/AsyncActionFactory';

// TODO: Error management
function loadAllUsers() {
  return Observable.from(PrincipalsApi.getAllUsers())
    .mergeMap(values)
    .map(Immutable.fromJS)
    .map(principal => {
      const reference = createPrincipalReference(principal.get('id'));
      return AsyncActionFactory.updateAsyncReference(reference, principal);
    })
}

function loadAllUsersEpic(action$) {
  return action$.ofType(PrincipalActionTypes.LOAD_ALL_USERS)
    .mergeMap(loadAllUsers)
}

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
  return action$.ofType(PrincipalActionTypes.LOAD_PRINCIPAL_DETAILS)
    .pluck('id')
    .mergeMap(loadPrincipal)
}

export default combineEpics(loadPrincipalEpic, loadAllUsersEpic);