import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import { NONE} from '../../utils/Consts/PermissionsSummaryConsts';
import { AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';

export function getRolePermissions(action) {
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

export function getUserPermissions(action, allUsersById) {
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
      if (roles.size > 1) {
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
