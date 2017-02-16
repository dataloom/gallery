/*
 * @flow
 */

import Immutable from 'immutable';

import {
  DataModels,
  Types
} from 'loom-data';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';
import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';
import * as PermissionsActionTypes from '../../permissions/PermissionsActionTypes';

const {
  Organization,
  Principal,
  PrincipalBuilder
} = DataModels;

const {
  PermissionTypes,
  PrincipalTypes
} = Types;

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isFetchingOrg: false,
  isFetchingOrgs: false,
  organizations: {}
});

export default function organizationsReducer(state :Immutable.Map = INITIAL_STATE, action :Object) :Immutable.Map {

  switch (action.type) {

    case OrgsActionTypes.FETCH_ORG_REQUEST:
      return state.set('isFetchingOrg', true);

    case OrgsActionTypes.FETCH_ORGS_REQUEST:
      return state.set('isFetchingOrgs', true);

    case OrgsActionTypes.FETCH_ORG_FAILURE:
      return state.set('isFetchingOrg', false);

    case OrgsActionTypes.FETCH_ORGS_FAILURE:
      return state.set('isFetchingOrgs', false);

    case OrgsActionTypes.FETCH_ORG_SUCCESS: {

      // TODO: do merge if organization exists

      const organization :Organization = action.organization;
      return state
        .setIn(['organizations', organization.id], Immutable.fromJS(organization))
        .set('isFetchingOrg', false);
    }

    case OrgsActionTypes.FETCH_ORGS_SUCCESS: {

      const orgs = {};
      action.organizations.forEach((org) => {
        orgs[org.id] = org;
        orgs[org.id].isOwner = false;
        orgs[org.id].permissions = {};
        Object.keys(PermissionTypes).forEach((permissionType :Permission) => {
          orgs[org.id].permissions[permissionType] = false;
        });
      });

      return state
        .set('organizations', Immutable.fromJS(orgs))
        .set('isFetchingOrgs', false);
    }

    case OrgsActionTypes.FETCH_ORGS_AUTHORIZATIONS_SUCCESS: {

      let newState :Immutable.Map = state;

      action.authorizations.forEach((authorization :Authorization) => {

        if (!authorization.aclKey || authorization.aclKey.length !== 1) {
          return;
        }

        const orgId :string = authorization.aclKey[0];
        const organization :Immutable.Map = state.getIn(['organizations', orgId], Immutable.Map());

        if (organization.isEmpty()) {
          return;
        }

        const decoratedOrganization :Immutable.Map = organization
          .set('isOwner', authorization.permissions[PermissionTypes.OWNER] === true)
          .set('permissions', Immutable.fromJS(authorization.permissions))

        newState = newState.setIn(['organizations', orgId], decoratedOrganization);
      });

      return newState;
    }

    case OrgActionTypes.CREATE_ORG_SUCCESS: {

      const organization :Organization = action.organization;
      return state.setIn(['organizations', organization.id], Immutable.Map(organization));
    }

    case OrgActionTypes.ADD_DOMAIN_TO_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const currentEmails :List<string> = state.getIn(['organizations', orgId, 'emails'], Immutable.List());
      const newEmails :List<string> = currentEmails.push(action.emailDomain);
      return state.setIn(['organizations', orgId, 'emails'], newEmails);
    }

    case OrgActionTypes.REMOVE_DOMAIN_FROM_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const currentEmails :List<string> = state.getIn(['organizations', orgId, 'emails'], Immutable.List());

      const index :number = currentEmails.findIndex((email) => {
        return email === action.emailDomain;
      });

      if (index < 0) {
        return state;
      }

      const newEmails :List<string> = currentEmails.delete(index);
      return state.setIn(['organizations', orgId, 'emails'], newEmails);
    }

    case OrgActionTypes.ADD_ROLE_TO_ORG_SUCCESS: {

      const newRolePrincipal :Principal = (new PrincipalBuilder())
        .setType(PrincipalTypes.ROLE)
        .setId(action.role)
        .build();

      const currentRoles :List<Principal> = state.getIn(['organizations', action.orgId, 'roles'], Immutable.List());
      // TODO: fix this conversion hell
      const newRoles :List<Principal> = currentRoles.push(
        Immutable.fromJS(JSON.parse(newRolePrincipal.valueOf()))
      );
      return state.setIn(['organizations', action.orgId, 'roles'], newRoles);
    }

    case OrgActionTypes.REMOVE_ROLE_FROM_ORG_SUCCESS: {

      const currentRoles :List<Principal> = state.getIn(['organizations', action.orgId, 'roles'], Immutable.List());

      const index :number = currentRoles.findIndex((role) => {
        return role.get('id') === action.role;
      });

      if (index < 0) {
        return state;
      }

      const newRoles :List<Principal> = currentRoles.delete(index);
      return state.setIn(['organizations', action.orgId, 'roles'], newRoles);
    }

    case OrgActionTypes.ADD_MEMBER_TO_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const newMemberPrincipal :Principal = (new PrincipalBuilder())
        .setType(PrincipalTypes.USER)
        .setId(action.memberId)
        .build();

      const currentMembers :List<Principal> = state.getIn(['organizations', orgId, 'members'], Immutable.List());
      // TODO: fix this conversion hell
      const newMembers :List<Principal> = currentMembers.push(
        Immutable.fromJS(JSON.parse(newMemberPrincipal.valueOf()))
      );
      return state.setIn(['organizations', orgId, 'members'], newMembers);
    }

    case OrgActionTypes.REMOVE_MEMBER_FROM_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const currentMembers :List<Principal> = state.getIn(['organizations', orgId, 'members'], Immutable.List());

      const index :number = currentMembers.findIndex((member) => {
        return member.get('id') === action.memberId;
      });

      if (index < 0) {
        return state;
      }

      const newMembers :List<Principal> = currentMembers.delete(index);
      return state.setIn(['organizations', orgId, 'members'], newMembers);
    }

    default:
      return state;
  }
}
