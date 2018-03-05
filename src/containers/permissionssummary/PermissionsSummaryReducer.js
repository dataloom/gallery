import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  allUsersById: {},
  allRolesList: [],
  entityUserPermissions: [],
  entityRolePermissions: {},
  propertyPermissions: {},
  isGettingUsersRoles: true,
  isGettingAcls: false,
  isGettingPermissions: false,
  isGettingOrganizations: false,
  isGettingRoles: false,
  isGettingMembers: false,
  orgsMembers: {},
  orgsRoles: []
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.GET_ALL_USERS_AND_ROLES_REQUEST:
      return state.set('isGettingUsersRoles', true);

    case actionTypes.GET_ALL_USERS_AND_ROLES_FAILURE:
      return state.set('isGettingUsersRoles', false);

    case actionTypes.GET_ALL_USERS_AND_ROLES_SUCCESS:
      return state.mergeDeep({
        isGettingUsersRoles: false,
        allUsersById: action.users,
        allRolesList: action.roles
      });

    case actionTypes.GET_ACLS:
      return state.set('isGettingAcls', true);

    case actionTypes.GET_USER_ROLE_PERMISSIONS_REQUEST:
      return state
      .set('isGettingAcls', false)
      .set('isGettingPermissions', true);

    case actionTypes.GET_USER_ROLE_PERMISSIONS_SUCCESS:
      return state.set('isGettingPermissions', false);

    case actionTypes.GET_USER_ROLE_PERMISSIONS_FAILURE:
      return state.set('isGettingPermissions', false);

    case actionTypes.SET_ROLE_PERMISSIONS: {
      const rolePermissions = action.data;

      if (action.property) {
        const rolePermissionsMerge = {
          propertyPermissions: {
            [action.property.title]: {
              rolePermissions
            }
          }
        };

        const rolePermissionsMergeImmutable = Immutable.fromJS(rolePermissionsMerge);
        const mergedState = state.mergeDeep(rolePermissionsMergeImmutable);
        return mergedState;
      }

      return state.mergeDeep({
        entityRolePermissions: Immutable.fromJS(rolePermissions)
      });
    }

    case actionTypes.SET_USER_PERMISSIONS: {
      const userPermissions = action.data;

      if (action.property) {
        const userPermissionsMerge = {
          propertyPermissions: {
            [action.property.title]: {
              userPermissions
            }
          }
        };
        const userPermissionsMergeImmutable = Immutable.fromJS(userPermissionsMerge);
        const mergedState = state.mergeDeep(userPermissionsMergeImmutable);
        return mergedState;
      }

      return state.mergeDeep({
        entityUserPermissions: Immutable.fromJS(userPermissions)
      });
    }

    case actionTypes.RESET_PERMISSIONS:
      return INITIAL_STATE;

    case actionTypes.SET_ORGS_MEMBERS: {
      const orgMembersMerge = {
        orgsMembers: {
          [action.members.orgId]: action.members.members
        }
      };
      return state.mergeDeep(orgMembersMerge);
    }

    case actionTypes.SET_ORGS_MEMBERS_FAILURE:
      return state.set('orgsMembers', Immutable.Map());

    case actionTypes.SET_ORGS_ROLES: {
      const orgRolesMerge = {
        orgsRoles: action.roles
      };
      return state.mergeDeep(orgRolesMerge);
    }

    case actionTypes.SET_ORGS_ROLES_FAILURE:
      return state.set('orgsRoles', Immutable.List());

    default:
      return state;
  }
}
