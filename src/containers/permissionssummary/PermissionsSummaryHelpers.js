import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import { NONE } from '../../utils/Consts/PermissionsSummaryConsts';
import { AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';

export function getUserPermissions(action, allUsersById) {
  const { userAcls, roleAcls, authenticatedUserPermissions } = action.data;
  const userPermissions = [];
  try {
    allUsersById.valueSeq().forEach((user) => {
      let userId;
      let nickname;
      let email;

      if (user) {
        userId = user.user_id;
        nickname = user.nickname;
        email = user.email;

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
        const roles = user.roles;
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
  }
  catch(e) {
    console.error('error:', e);
  }
  
  return userPermissions;
}
