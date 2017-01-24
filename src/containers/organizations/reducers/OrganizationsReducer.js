/*
 * @flow
 */

import Immutable from 'immutable';

import {
  DataModels,
  Types
} from 'loom-data';

import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';
import * as PermissionsActionTypes from '../../permissions/PermissionsActionTypes';

import {
  ASYNC_STATUS
} from '../../../components/asynccontent/AsyncContent';

const {
  Principal,
  PrincipalBuilder
} = DataModels;

const {
  PermissionTypes,
  PrincipalTypes
} = Types;

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  asyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  isFetchingOrg: false,
  isFetchingOrgs: false,
  organizations: {}
});

export default function organizationsReducer(state :Map<*, *> = INITIAL_STATE, action :Object) :Map<*, *> {

  switch (action.type) {

    case OrgsActionTypes.FETCH_ORG_REQUEST:
      return state.set('isFetchingOrg', true);

    case OrgsActionTypes.FETCH_ORGS_REQUEST:
      return state
        .set('isFetchingOrgs', true)
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }));

    case OrgsActionTypes.FETCH_ORG_SUCCESS: {

      const org = action.organization;
      return state
        .set('isFetchingOrg', false)
        .setIn(['organizations', org.id], Immutable.fromJS(org));
    }

    case OrgsActionTypes.FETCH_ORGS_SUCCESS: {

      const orgs = {};
      action.organizations.forEach((org) => {
        orgs[org.id] = org;
        orgs[org.id].isOwner = false;
      });

      return state
        .set('isFetchingOrgs', false)
        .set('organizations', Immutable.fromJS(orgs))
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }));
    }

    case OrgsActionTypes.FETCH_ORG_FAILURE:
    case OrgsActionTypes.FETCH_ORGS_FAILURE:
      return INITIAL_STATE
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.ERROR,
          errorMessage: 'Failed to load Organizations'
        }));

    case PermissionsActionTypes.CHECK_AUTHORIZATION_RESOLVE: {

      let newState :Map<*, *> = state;

      const authorizations = action.authorizations;
      authorizations.forEach((auth) => {

        if (!auth.aclKey || auth.aclKey.length !== 1) {
          return;
        }

        const orgId = auth.aclKey[0];
        const org = state.getIn(['organizations', orgId]);

        if (!org) {
          return;
        }

        const orgDeco = org.set('isOwner', (auth.permissions[PermissionTypes.OWNER] === true));
        newState = newState.setIn(['organizations', orgId], orgDeco);
      });

      return newState;
    }

    case OrgsActionTypes.ADD_DOMAIN_TO_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const currentEmails :List<string> = state.getIn(['organizations', orgId, 'emails'], Immutable.List());
      const newEmails :List<string> = currentEmails.push(action.emailDomain);
      return state.setIn(['organizations', orgId, 'emails'], newEmails);
    }

    case OrgsActionTypes.REMOVE_DOMAIN_FROM_ORG_SUCCESS: {

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

    case OrgsActionTypes.ADD_ROLE_TO_ORG_SUCCESS: {

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

    case OrgsActionTypes.REMOVE_ROLE_FROM_ORG_SUCCESS: {

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

    case OrgsActionTypes.ADD_MEMBER_TO_ORG_SUCCESS: {

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

    case OrgsActionTypes.REMOVE_MEMBER_FROM_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const currentMembers :List<Principal> = state.getIn(['organizations', orgId, 'members'], Immutable.List());

      const index :number = currentMembers.findIndex((member) => {
        return member.get('id') === action.memberId;
      });

      if (index < 0) {
        return state;
      }

      const newMembers :List<Principal> = currentMembers.delete(index);
      return state.setIn(['organizations', action.orgId, 'members'], newMembers);
    }

    default:
      return state;
  }
}
