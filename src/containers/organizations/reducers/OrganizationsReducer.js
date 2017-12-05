/*
 * @flow
 */

import Immutable from 'immutable';

import {
  Models,
  Types
} from 'lattice';

import * as PermissionsActionTypes from '../../permissions/PermissionsActionTypes';
import * as PrincipalsActionTypes from '../../principals/PrincipalsActionTypes';

import * as OrgActionTypes from '../actions/OrganizationActionTypes';
import * as OrgsActionTypes from '../actions/OrganizationsActionTypes';

import { AUTHENTICATED_USER } from '../../../utils/Consts/UserRoleConsts';

const {
  Ace,
  Organization,
  Principal,
  PrincipalBuilder,
  Role,
  RoleBuilder
} = Models;

const {
  ActionTypes,
  PermissionTypes,
  PrincipalTypes
} = Types;

/*
 * TODO: we probably need a better pattern than "isSearchingUsers". as an example, this reducer will execute the
 * search users success case since it is possible to dispatch the search users action from anywhere in the app.
 * I think we need a more intelligent approach to dispatching generic actions so that 1) they are specifically tied to
 * the container that is dispatching them, and 2) we avoid having the reducer handle a generic action.
 */

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  isCreatingOrg: false,
  isFetchingOrg: false,
  isFetchingOrgs: false,
  isSearchingOrgs: false,
  isSearchingUsers: false,
  organizations: Immutable.Map(),
  visibleOrganizationIds: Immutable.Set(),
  usersSearchResults: Immutable.Map(),
  members: Immutable.List()
});

export default function organizationsReducer(state :Immutable.Map = INITIAL_STATE, action :Object) :Immutable.Map {

  switch (action.type) {

    case OrgActionTypes.CREATE_ORG_REQUEST:
      return state.set('isCreatingOrg', true);

    case OrgActionTypes.CREATE_ORG_FAILURE:
      return state.set('isCreatingOrg', false);

    case OrgsActionTypes.FETCH_ORG_REQUEST:
      return state.set('isFetchingOrg', true);

    case OrgsActionTypes.FETCH_ORG_FAILURE: {
      // TODO: not sure if clearing the Organization data isright. re-evaluate this decision,
      return state
        .setIn(['organizations', action.orgId], Immutable.Map())
        .set('isFetchingOrg', false);
    }

    case OrgsActionTypes.FETCH_ORGS_REQUEST:
      return state.set('isFetchingOrgs', true);

    case OrgsActionTypes.FETCH_ORGS_FAILURE:
      return state.set('isFetchingOrgs', false);

    case OrgsActionTypes.SEARCH_ORGS_REQUEST:
      return state.set('isSearchingOrgs', true);

    case OrgsActionTypes.SEARCH_ORGS_FAILURE:
      return state.set('isSearchingOrgs', false);

    case OrgsActionTypes.FETCH_ORG_SUCCESS: {

      // TODO: do merge if organization exists

      const organization :Organization = action.organization;
      return state
        .setIn(['organizations', organization.id], Immutable.fromJS(organization))
        .set('isCreatingOrg', false)
        .set('isFetchingOrg', false);
    }

    case OrgsActionTypes.FETCH_ORGS_SUCCESS: {

      const orgs = {};
      action.organizations.forEach((org) => {
        orgs[org.id] = org;
        orgs[org.id].isOwner = false;
        orgs[org.id].isPublic = false;
        orgs[org.id].permissions = {};
        Object.keys(PermissionTypes).forEach((permissionType :Permission) => {
          orgs[org.id].permissions[permissionType] = false;
        });
      });

      const organizations :Immutable.Map = Immutable.fromJS(orgs);

      return state
        .set('organizations', organizations)
        .set('visibleOrganizationIds', Immutable.Set(organizations.keys()))
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

      /*
       * we are *not* setting "isCreatingOrg" to false here because creating an organization involves 2 steps:
       *
       *   1. make the HTTP request to create the organization and get back the org UUID
       *   2. once we actually have the org UUID, we route from /org/new to /org/{orgId}, which does a fetch
       *
       * once we've successfully routed to /org/{orgId} and finished the fetch is when we're done with the process of
       * creating an organization. as such, we set "isCreatingOrg" to false in the FETCH_ORG_SUCCESS case.
       */

      const organization :Organization = action.organization;
      return state.setIn(['organizations', organization.id], Immutable.Map(organization));
    }

    case OrgActionTypes.DELETE_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      return state.deleteIn(['organizations', orgId]);
    }

    case OrgActionTypes.UPDATE_ORG_TITLE_SUCCESS: {

      return state.setIn(['organizations', action.orgId, 'title'], action.title);
    }

    case OrgActionTypes.ADD_DOMAIN_TO_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const currentEmails :List<string> = state.getIn(['organizations', orgId, 'emails'], Immutable.List());
      const updatedEmails :List<string> = currentEmails.push(action.emailDomain);
      return state.setIn(['organizations', orgId, 'emails'], updatedEmails);
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

      const updatedEmails :List<string> = currentEmails.delete(index);
      return state.setIn(['organizations', orgId, 'emails'], updatedEmails);
    }

    case OrgActionTypes.ADD_ROLE_TO_ORG_SUCCESS: {


      const newRole :Role = (new RoleBuilder())
        .setId(action.roleId)
        .setOrganizationId(action.role.organizationId)
        .setTitle(action.role.title)
        .setPrincipal(action.role.principal)
        .build();

      const orgId :UUID = action.role.organizationId;
      const currentRoles :List<Role> = state.getIn(['organizations', orgId, 'roles'], Immutable.List());
      const updatedRoles :List<Role> = currentRoles.push(Immutable.Map(newRole));
      return state.setIn(['organizations', orgId, 'roles'], updatedRoles);
    }

    case OrgActionTypes.REMOVE_ROLE_FROM_ORG_SUCCESS: {

      const currentRoles :List<Role> = state.getIn(['organizations', action.orgId, 'roles'], Immutable.List());

      const index :number = currentRoles.findIndex((role) => {
        return role.get('id') === action.roleId;
      });

      if (index < 0) {
        return state;
      }

      const updatedRoles :List<Role> = currentRoles.delete(index);
      return state.setIn(['organizations', action.orgId, 'roles'], updatedRoles);
    }

    case OrgActionTypes.ADD_MEMBER_TO_ORG_SUCCESS: {

      const orgId :string = action.orgId;
      const newMemberPrincipal :Principal = (new PrincipalBuilder())
        .setType(PrincipalTypes.USER)
        .setId(action.memberId)
        .build();

      const currentMembers :List<Principal> = state.getIn(['organizations', orgId, 'members'], Immutable.List());
      const updatedMembers :List<Principal> = currentMembers.push(Immutable.Map(newMemberPrincipal));

      // update users search results to remove the member just added
      const usersSearchResults :Immutable.Map = state.get('usersSearchResults');
      let updatedUserSearchResults :Immutable.Map = usersSearchResults;
      if (!usersSearchResults.isEmpty()) {
        updatedUserSearchResults = usersSearchResults.filter((user :Immutable.Map) => {
          return user.get('user_id') !== action.memberId;
        });
      }

      return state
        .setIn(['organizations', orgId, 'members'], updatedMembers)
        .set('usersSearchResults', updatedUserSearchResults);
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

      const updatedMembers :List<Principal> = currentMembers.delete(index);
      return state.setIn(['organizations', orgId, 'members'], updatedMembers);
    }

    case OrgsActionTypes.SHOW_ALL_ORGS: {

      const organizations :Immutable.Map = state.get('organizations');
      return state.set('visibleOrganizationIds', Immutable.Set(organizations.keys()));
    }

    case OrgActionTypes.CLEAR_USER_SEARCH_RESULTS:
      return state
        .set('isSearchingUsers', false)
        .set('usersSearchResults', Immutable.Map());

    case OrgsActionTypes.SEARCH_ORGS_SUCCESS: {

      const orgIds :Immutable.Set = Immutable.Set().withMutations((set :Immutable.Set) => {
        action.searchResults.hits.forEach((result :Object) => {
          set.add(result.id);
        });
      });

      return state
        .set('visibleOrganizationIds', orgIds)
        .set('isSearchingOrgs', false);
    }

    case PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_REQUEST:
      return state
        .set('isSearchingUsers', true)
        .set('usersSearchResults', Immutable.Map());

    case PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_FAILURE:
      return state
        .set('isSearchingUsers', false)
        .set('usersSearchResults', Immutable.Map());

    // TODO: probably need to break this out into its own reducer, along with the organizations earch
    case PrincipalsActionTypes.SEARCH_ALL_USERS_BY_EMAIL_SUCCESS: {

      // only update state if the users search request was dispatched by us
      if (state.get('isSearchingUsers') === false) {
        return state;
      }

      // TODO: filter out search results that include members already part of the organization being viewed

      return state
        .set('usersSearchResults', Immutable.fromJS(action.searchResults))
        .set('isSearchingUsers', false);
    }

    // it is possible to dispatch GET_ACL_REQUEST from anywhere in the app
    // TODO: consider refactoring, as it is very similar to the PermissionsActionTypes.UPDATE_ACL_SUCCESS case
    case PermissionsActionTypes.GET_ACL_SUCCESS: {

      if (!action.aclKey || action.aclKey.length !== 1) {
        return state;
      }

      const orgId :UUID = action.aclKey[0];
      const organization :Immutable.Map = state.getIn(['organizations', orgId], Immutable.Map());

      if (organization.isEmpty()) {
        return state;
      }

      // an Organization is considered to be public if it has READ permissions for AUTHENTICATED_USER principals
      // TODO: yuck!
      let isPublic :boolean = false;
      action.acl.aces.forEach((ace :Ace) => {
        if (ace.principal.id === AUTHENTICATED_USER) {
          ace.permissions.forEach((permission :string) => {
            if (permission === PermissionTypes.READ) {
              isPublic = true;
            }
          });
        }
      });

      const decoratedOrganization :Immutable.Map = organization.set('isPublic', isPublic);
      return state.setIn(['organizations', orgId], decoratedOrganization);
    }

    // it is possible to dispatch UPDATE_ACL_REQUEST from anywhere in the app
    // TODO: consider refactoring, as it is very similar to the PermissionsActionTypes.GET_ACL_SUCCESS case
    case PermissionsActionTypes.UPDATE_ACL_SUCCESS: {

      if (!action.aclData
          || !action.aclData.acl
          || !action.aclData.acl.aclKey
          || action.aclData.acl.aclKey.length !== 1) {
        return state;
      }

      const orgId :UUID = action.aclData.acl.aclKey[0];
      const organization :Immutable.Map = state.getIn(['organizations', orgId], Immutable.Map());

      if (organization.isEmpty()) {
        return state;
      }

      // an Organization is considered to be public if it has READ permissions for AUTHENTICATED_USER principals
      // TODO: yuck!
      let isPublic :boolean = organization.get('isPublic');
      action.aclData.acl.aces.forEach((ace :Ace) => {
        if (ace.principal.id === AUTHENTICATED_USER) {
          ace.permissions.forEach((permission :string) => {
            if (permission === PermissionTypes.READ && action.aclData.action === ActionTypes.SET) {
              isPublic = true;
            }
            else if (permission === PermissionTypes.READ && action.aclData.action === ActionTypes.REMOVE) {
              isPublic = false;
            }
          });
        }
      });

      const decoratedOrganization :Immutable.Map = organization.set('isPublic', isPublic);
      return state.setIn(['organizations', orgId], decoratedOrganization);
    }

    case OrgActionTypes.FETCH_MEMBERS_SUCCESS:
      return state.set('members', Immutable.fromJS(action.members));

    default:
      return state;
  }
}
