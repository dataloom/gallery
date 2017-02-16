/*
 * @flow
 */

import {
  DataModels,
  Types,
  AuthorizationApi,
  OrganizationsApi
} from 'loom-data';

import {
  combineEpics
} from 'redux-observable';

import {
  Observable
} from 'rxjs';

import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';
import * as OrgsActionFactory from '../actions/OrganizationsActionFactory';

const { Organization } = DataModels;
const { PermissionTypes } = Types;

/*
 * TODO: figure out how to set a timeout when loading takes too long, we terminate and dispatch fetchFailed actions
 */

function fetchOrganizationEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORG_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(OrganizationsApi.getOrganization(action.orgId))
        .mergeMap((organization :Organization) => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationSuccess(organization),
            OrgsActionFactory.fetchOrganizationsAuthorizationsRequest([organization])
          );
        })
        .catch(() => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationFailure()
          );
        });
    });
}

function fetchOrganizationsEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORGS_REQUEST)
    .mergeMap(() => {
      return Observable
        .from(OrganizationsApi.getAllOrganizations())
        .mergeMap((organizations :Organization[]) => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsSuccess(organizations),
            OrgsActionFactory.fetchOrganizationsAuthorizationsRequest(organizations)
          );
        })
        .catch(() => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsFailure()
          );
        });
    });
}

function fetchOrganizationsAuthorizationsEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_REQUEST)
    .mergeMap((action :Action) => {
      const accessChecks = action.organizations.map((org :Organization) => {
        return {
          aclKey: [org.id],
          permissions: Object.keys(PermissionTypes)
        };
      });
      return Observable
        .from(AuthorizationApi.checkAuthorizations(accessChecks))
        .mergeMap((authorizations :Authorization[]) => {
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsAuthorizationsSuccess(authorizations)
          );
        })
        .catch((e) => {
          console.error(e);
          return Observable.of(
            OrgsActionFactory.fetchOrganizationsAuthorizationsFailure()
          );
        });
    });
}

export default combineEpics(
  fetchOrganizationEpic,
  fetchOrganizationsEpic,
  fetchOrganizationsAuthorizationsEpic
);
