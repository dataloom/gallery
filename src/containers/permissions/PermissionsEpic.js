/*
 * @flow
 */

import {
  AuthorizationApi,
  PermissionsApi,
  RequestsApi,
  DataModels
} from 'loom-data';

import {
  Observable
} from 'rxjs';

import {
  combineEpics
} from 'redux-observable'

import * as PermissionsActionTypes from './PermissionsActionTypes';
import * as PermissionsActionFactory from './PermissionsActionFactory';
import AsyncActionFactory from '../async/AsyncActionFactory';

import {
  STATUS as ASYNC_STATUS
} from '../async/AsyncStorage';

import {
  deserializeAuthorization,
  createStatusAsyncReference,
  createAuthnAsyncReference
} from './PermissionsStorage';

import type {
  AccessCheck,
  AuthNRequest,
  AclKey,
  Status
} from './PermissionsStorage'

const { Acl } = DataModels;

function updateStatuses(statuses :Status[]) {
  return Observable.from(statuses)
    .mergeMap(status => {
      return Observable.from(RequestsApi.updateRequestStatuses([status]))
        .mapTo(AsyncActionFactory.updateAsyncReference(createStatusAsyncReference(status.aclKey), status))
        .catch(console.error);
    });
}

function updateStatusesEpic(action$) {
  return action$.ofType(PermissionsActionTypes.UPDATE_STATUSES)
    .pluck('statuses')
    .mergeMap(updateStatuses)
}

function loadStatuses(reqStatus :string, aclKeys :AclKey[]) {
  const references = aclKeys.map(createStatusAsyncReference);
  return Observable.merge(
    Observable.from(references)
      .map(AsyncActionFactory.asyncReferenceLoading),

    Observable.from(
      RequestsApi.getAllRequestStatuses({
        state: reqStatus,
        aclKeys
      })
    )
    // Observable.of([
    //   {
    //     "aclKey": [
    //       "c5c20cae-060b-4ae7-8d6a-95648ed60246",
    //       "b43b8d12-12af-4356-8713-a9b7cb3876dc"
    //     ],
    //     "permissions": [
    //       "READ"
    //     ],
    //     "principal": {
    //       "id": "auth0|57e4b2d8d9d1d194778fd5b6",
    //       "type": "USER"
    //     },
    //     "status": "SUBMITTED"
    //   },
    //   {
    //     "aclKey": [
    //       "c5c20cae-060b-4ae7-8d6a-95648ed60246",
    //       "34fd7582-90e5-4663-96c5-65dfe7ea9648"
    //     ],
    //     "permissions": [
    //       "READ"
    //     ],
    //     "principal": {
    //       "id": "auth0|57e4b2d8d9d1d194778fd5b6",
    //       "type": "USER"
    //     },
    //     "status": "SUBMITTED"
    //   }
    // ])
    .mergeMap(statuses => {
      const statusByReferenceId = {};
      statuses.forEach(status => {
        statusByReferenceId[createStatusAsyncReference(status.aclKey).id] = status;
      });

      return references.map(reference => {
        const status = statusByReferenceId[reference.id];
        const value = status ? status : ASYNC_STATUS.NOT_FOUND;
        return AsyncActionFactory.updateAsyncReference(reference, value);
      });
    })
  );
}

function loadStatusesEpic(action$) {
  return action$.ofType(PermissionsActionTypes.LOAD_STATUSES)
    .mergeMap(action => loadStatuses(action.reqStatus, action.aclKeys));
}

function submitAuthnRequest(requests :AuthNRequest[]) :Observable<Action> {
  return Observable
    .from(RequestsApi.submitRequests(requests))
    .mapTo(PermissionsActionFactory.requestPermissionsModalSuccess())
    .catch(e => {
      return Observable.of(PermissionsActionFactory.requestPermissionsModalError())
    });
}

function submitAuthnRequestEpic(action$ :Observable<Action>) :Observable<Action> {
  return action$
    .ofType(PermissionsActionTypes.SUBMIT_AUTHN_REQUEST)
    .pluck('requests')
    .mergeMap(submitAuthnRequest);
}

// TODO: Move entirely to async container and take *huge* advantage of caching
function authorizationCheck(accessChecks :AccessCheck[]) :Observable<Action> {

  const references = accessChecks.map(check => {
    return createAuthnAsyncReference(check.aclKey);
  });

  return Observable.merge(
    Observable
      .from(references)
      .map(AsyncActionFactory.asyncReferenceLoading),

    Observable
      .from(AuthorizationApi.checkAuthorizations(accessChecks))
      .map((authorizations) => {
        return authorizations.map(deserializeAuthorization);
      })
      .mergeMap(authorizations => {
        // Async
        const actions = authorizations.map(authn => {
          return AsyncActionFactory.updateAsyncReference(createAuthnAsyncReference(authn.aclKey), authn);
        });
        // Old Code
        actions.push(PermissionsActionFactory.checkAuthorizationResolve(authorizations));
        return actions;
      })
      .catch(() => {
        // Async
        const actions = references.map(reference => {
          return AsyncActionFactory.asyncReferenceError(reference, 'Error loading authorization');
        });
        // Old Code
        actions.push(PermissionsActionFactory.checkAuthorizationReject(accessChecks, 'Error loading authorizations'));
        return Observable.from(actions);
      })
  );
}

// TODO: Cancellation and Error handling
function authorizationCheckEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PermissionsActionTypes.CHECK_AUTHORIZATION_REQUEST)
    .pluck('accessChecks')
    .mergeMap(authorizationCheck);
}

/*
 * TODO: I don't understand the "reference" pattern, so I don't want to touch anything above so not to break anything,
 * but PermissionsEpic seems like the correct place to put the rest of the PermissionsApi-related actions. I need to
 * better understand how these references work to figure out whether or not to continue with that pattern.
 */

function getAclEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PermissionsActionTypes.GET_ACL_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(PermissionsApi.getAcl(action.aclKey))
        .mergeMap((acl :Acl) => {
          return Observable.of(
            PermissionsActionFactory.getAclSuccess(action.aclKey, acl)
          );
        })
        .catch(() => {
          return Observable.of(
            PermissionsActionFactory.getAclFailure(action.aclKey)
          );
        });
    });
}
function updateAclEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(PermissionsActionTypes.UPDATE_ACL_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(PermissionsApi.updateAcl(action.aclData))
        .mergeMap(() => {
          return Observable.of(
            PermissionsActionFactory.updateAclSuccess(action.aclData)
          );
        })
        .catch(() => {
          return Observable.of(
            PermissionsActionFactory.updateAclFailure(action.aclData)
          );
        });
    });
}

export default combineEpics(
  authorizationCheckEpic,
  submitAuthnRequestEpic,
  loadStatusesEpic,
  updateStatusesEpic,
  getAclEpic,
  updateAclEpic
);
