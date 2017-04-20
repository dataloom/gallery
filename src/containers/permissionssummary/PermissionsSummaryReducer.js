import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import { NONE} from '../../utils/Consts/PermissionsSummaryConsts';
import { AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';


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

/* HELPER FUNCTIONS */
function getUserPermissions(action, allUsersById) {
  const { userAcls, roleAcls, authenticatedUserPermissions } = action.data;
  const userPermissions = [];

  allUsersById.valueSeq().forEach((user) => {
    let userId;
    let nickname;
    let email;

    if (user) {
      userId = user.get('user_id');
      nickname = user.get('nickname');
      email = user.get('email');

      const userObj = {
        id: userId,
        nickname,
        email,
        roles: [],
        permissions: [],
        individualPermissions: []
      };

      // Get all user permissions (sum of individual + roles + default);
      Object.keys(userAcls).forEach((permissionKey) => {
        if (userAcls[permissionKey].indexOf(userId) !== -1) {
          userObj.permissions.push(permissionKey);
          // Save individual permissions separately
          userObj.individualPermissions.push(permissionKey);
        }
      });

      // Add additional permissions based on the roles the user has
      const roles = user.get('roles');
      if (!((roles.includes(AUTHENTICATED_USER) && roles.size === 1) || roles.size === 0)) {
        Object.keys(roleAcls).forEach((permissionKey) => {
          roles.forEach((role) => {
            if (roleAcls[permissionKey].indexOf(role) !== -1 && userObj.permissions.indexOf(permissionKey) === -1) {
              userObj.permissions.push(permissionKey);
            }
            if (userObj.roles.indexOf(role) === -1 && role !== AUTHENTICATED_USER) {
              userObj.roles.push(role);
            }
          });
        });
      }

      // Add additional permissions based on default for all users
      if (authenticatedUserPermissions) {
        authenticatedUserPermissions.forEach((permission) => {
          if (userObj.permissions.indexOf(permission) === -1) {
            userObj.permissions.push(permission);
          }
        });
      }

      userPermissions.push(userObj);
    }
  });
  return userPermissions;
}

function getRolePermissions(action) {
  const { roleAcls, authenticatedUserPermissions } = action.data;
  const rolePermissions = {};

  // Get all roles and their respective permissions
  Object.keys(roleAcls).forEach((permission) => {
    roleAcls[permission].forEach((role) => {
      if (!Object.prototype.hasOwnProperty.call(rolePermissions, role)) {
        rolePermissions[role] = [];
      }
      if (rolePermissions[role].indexOf(permission) === -1) {
        rolePermissions[role].push(permission);
      }
    });
  });

  rolePermissions[AUTHENTICATED_USER] = authenticatedUserPermissions.length === 0 ? [NONE] : authenticatedUserPermissions;
  return rolePermissions;
}


/* REDUCER */
export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.GET_ALL_USERS_AND_ROLES_REQUEST:
      return state.set('isGettingUsersRoles', true);

    case actionTypes.GET_ALL_USERS_AND_ROLES_FAILURE:
      return state.set('isGettingUsersRoles', false);

    case actionTypes.GET_ALL_USERS_AND_ROLES_SUCCESS:
      return state.merge({
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
      return state.merge({
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

      return state.merge({
        entityUserPermissions: userPermissions
      });
    }

    case actionTypes.RESET_PERMISSIONS:
      return INITIAL_STATE;

    default:
      return state;
  }
}
