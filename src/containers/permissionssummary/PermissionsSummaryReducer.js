import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import { NONE } from '../../utils/Consts/PermissionsSummaryConsts';
import { AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';
import { getRolePermissions, getUserPermissions } from './PermissionsSummaryHelpers';


export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  allUsersById: {},
  allRolesList: [],
  entityUserPermissions: [],
  entityRolePermissions: {},
  propertyPermissions: {},
  isGettingUsersRoles: true,
  isGettingAcls: false,
  isGettingPermissions: false
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
      const rolePermissions = Immutable.fromJS(getRolePermissions(action));
      if (action.property) {
        const rolePermissionsMerge = {
          propertyPermissions: {
            [action.property.title]: {
              rolePermissions
            }
          }
        };
        return state.mergeDeep(rolePermissionsMerge);
      }
      return state.mergeDeep({
        entityRolePermissions: rolePermissions
      });
    }

    case actionTypes.SET_USER_PERMISSIONS: {
      const allUsersById = state.get('allUsersById');
      const userPermissions = Immutable.fromJS(getUserPermissions(action, allUsersById));
      if (action.property) {
        const userPermissionsMerge = {
          propertyPermissions: {
            [action.property.title]: {
              userPermissions
            }
          }
        };
        return state.mergeDeep(userPermissionsMerge);
      }

      return state.mergeDeep({
        entityUserPermissions: userPermissions
      });
    }

    case actionTypes.RESET_PERMISSIONS:
      return INITIAL_STATE;

    default:
      return state;
  }
}
