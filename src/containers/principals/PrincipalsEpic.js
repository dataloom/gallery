/* @flow */
import Immutable from 'immutable';
import { Observable } from 'rxjs/Observable';

import { PrincipalsApi } from 'loom-data';

import PrincipalActionTypes from './PrincipalsActionTypes';
import { createPrincipalReference } from './PrincipalsStorage';
import AsyncActionFactory from '../async/AsyncActionFactory';

function loadPrincipal(id :string) {
  const reference = createPrincipalReference(id);
  return Observable.merge(
    Observable.of(AsyncActionFactory.asyncReferenceLoading(reference)),
    Observable.from(PrincipalsApi.getUser(id))
      .map(Immutable.fromJS)
      .map(principal => {
        return AsyncActionFactory.updateAsyncReference(reference, principal);
      })
      .catch(error => AsyncActionFactory.asyncReferenceError('Failed to load principal')));
}

function loadPrincipalEpic(action$) {
  return action$.ofType(PrincipalActionTypes.LOAD_PRINCIPAL_DETAILS)
    .pluck('id')
    .mergeMap(loadPrincipal)
}

export default loadPrincipalEpic;