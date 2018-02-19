import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import { getRolePermissions, getUserPermissions } from './PermissionsSummaryHelpers';


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
  isGettingMembers: false
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.GET_ALL_ORGANIZATIONS_REQUEST:
      return state.set('isGettingOrganizations', true);

    case actionTypes.GET_ALL_ORGANIZATIONS_SUCCESS:
      return state.set('isGettingOrganizations', false);
    
    case actionTypes.GET_ALL_ORGANIZATIONS_FAILURE:
      return state.set('isGettingOrganizations', false);

    case actionTypes.GET_ALL_ROLES_REQUEST:
      return state.set('isGettingRoles', true);

    case actionTypes.GET_ALL_ROLES_SUCCESS:
      return state.set('isGettingRoles', false);
    
    case actionTypes.GET_ALL_ROLES_FAILURE:
      return state.set('isGettingRoles', false);

    case actionTypes.GET_ALL_MEMBERS_REQUEST:
      return state.set('isGettingMembers', true);

    case actionTypes.GET_ALL_MEMBERS_SUCCESS:
      return state.set('isGettingMembers', false);
    
    case actionTypes.GET_ALL_MEMBERS_FAILURE:
      return state.set('isGettingMembers', false);

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
      const rolePermissions = getRolePermissions(action);

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
      const allUsersById = state.get('allUsersById');
      const userPermissions = getUserPermissions(action, allUsersById);

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

    default:
      return state;
  }
}
