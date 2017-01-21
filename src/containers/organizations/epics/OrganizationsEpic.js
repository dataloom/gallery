/*
 * @flow
 */

import {
  DataModels,
  Types,
  OrganizationsApi
} from 'loom-data';

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
  PermissionTypes
} = Types;

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
    .mergeMap(fetchOrgs);
}
