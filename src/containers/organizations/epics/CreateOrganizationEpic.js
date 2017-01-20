/*
 * @flow
 */

import {
  DataModels,
  Types,
  OrganizationsApi,
  PermissionsApi
} from 'loom-data';

import {
  Observable
} from 'rxjs';

import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';

import {
  AUTHENTICATED_USER
} from '../../../utils/Consts/UserRoleConsts';

const {
  Acl,
  AclBuilder,
  AclData,
  AclDataBuilder,
  Ace,
  AceBuilder,
  Principal,
  PrincipalBuilder
} = DataModels;

const {
  ActionTypes,
  PermissionTypes,
  PrincipalTypes
} = Types;

function setNewOrgPermissions(newOrgId :UUID) {

  const principal :Principal = (new PrincipalBuilder())
    .setType(PrincipalTypes.ROLE)
    .setId(AUTHENTICATED_USER)
    .build();

  const ace :Ace = (new AceBuilder())
    .setPermissions([PermissionTypes.READ])
    .setPrincipal(principal)
    .build();

  const acl :Acl = (new AclBuilder())
    .setAclKey([newOrgId])
    .setAces([ace])
    .build();

  const aclData :AclData = (new AclDataBuilder())
    .setAction(ActionTypes.SET)
    .setAcl(acl)
    .build();

  return Observable
    .from(PermissionsApi.updateAcl(aclData))
    .catch((e) => {
      console.error(e);
    });
}

function createNewOrg(action :Object) {

  return Observable
    .from(OrganizationsApi.createOrganization(action.org))
    .mergeMap((newOrgId :UUID) => {
      return setNewOrgPermissions(newOrgId);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function createOrgEpic(action$ :Observable<Object>) {

  return action$
    .ofType(OrgsActionTypes.CREATE_NEW_ORG)
    .mergeMap((action :Object) => {
      return createNewOrg(action);
    });
}
