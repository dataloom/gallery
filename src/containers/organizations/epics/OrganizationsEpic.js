/*
 * @flow
 */

import {
  DataModels,
  Types,
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
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';

const {
  Organization
} = DataModels;

const {
  PermissionTypes,
  PrincipalTypes
} = Types;

function fetchOrg(action :Action) :Observable<Action> {

  const { orgId } = action;
  return Observable
    .from(OrganizationsApi.getOrganization(orgId))
    .mergeMap((organization :Organization) => {
      // TODO: PermissionsActionFactory.checkAuthorizationRequest
      return Observable.of(
        OrgsActionFactory.fetchOrgSuccess(organization)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.fetchOrgFailure()
      );
    });
}

export function fetchOrgEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORG_REQUEST)
    .mergeMap(fetchOrg)
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.fetchOrgFailure()
      );
    });
}

function fetchOrgs() :Observable<Action> {

  return Observable
    .from(OrganizationsApi.getAllOrganizations())
    .mergeMap((organizations :Organization[]) => {

      const isOwnerAccessChecks = organizations.map((org :Organization) => {
        return {
          aclKey: [org.id],
          permissions: [PermissionTypes.OWNER]
        };
      });

      return Observable.of(
        OrgsActionFactory.fetchOrgsSuccess(organizations),
        PermissionsActionFactory.checkAuthorizationRequest(isOwnerAccessChecks)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.fetchOrgsFailure()
      );
    });
}

export function fetchOrgsEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.FETCH_ORGS_REQUEST)
    .mergeMap(fetchOrgs)
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.fetchOrgsFailure()
      );
    });
}

function addMemberToOrg(action :Action) :Observable<Action> {

  const {
    orgId,
    memberId
  } = action;

  return Observable
    .from(OrganizationsApi.addPrincipal(orgId, PrincipalTypes.USER, memberId))
    .mergeMap(() => {
      return Observable.of(
        OrgsActionFactory.addMemberToOrgSuccess(orgId, memberId)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.addMemberToOrgFailure()
      );
    });
}

export function addMemberToOrgEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.ADD_MEMBER_TO_ORG_REQUEST)
    .mergeMap(addMemberToOrg);
}

function removeMemberFromOrg(action :Action) :Observable<Action> {

  const {
    orgId,
    memberId
  } = action;

  return Observable
    .from(OrganizationsApi.removePrincipal(orgId, PrincipalTypes.USER, memberId))
    .mergeMap(() => {
      return Observable.of(
        OrgsActionFactory.removeMemberFromOrgSuccess(orgId, memberId)
      );
    })
    .catch(() => {
      return Observable.of(
        OrgsActionFactory.removeMemberFromOrgFailure()
      );
    });
}

export function removeMemberFromOrgEpic(action$ :Observable<Action>) :Observable<Action> {

  return action$
    .ofType(OrgsActionTypes.REMOVE_MEMBER_FROM_ORG_REQUEST)
    .mergeMap(removeMemberFromOrg);
}

export default combineEpics(
  fetchOrgEpic,
  fetchOrgsEpic,
  addMemberToOrgEpic,
  removeMemberFromOrgEpic
);
