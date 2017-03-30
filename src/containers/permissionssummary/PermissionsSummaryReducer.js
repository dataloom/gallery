import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as psActionFactory from './PermissionsSummaryActionFactory';
import * as permissionsActionTypes from '../permissions/permissionsActionTypes';
import { ROLE, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  allUsersById: {},
  allRolesList: [],
  loadUsersError: false,
  roleAcls: {},
  userAcls: {},
  globalValue: [],
  properties: {},
  newRoleValue: '',
  newEmailValue: '',
  updateSuccess: false,
  updateError: false,
  entityUserPermissions: [],
  entityRolePermissions: {},
  propertyPermissions: {},
  acl: {}
});

const permissionOptions = {
  Discover: 'Discover',
  Link: 'Link',
  Read: 'Read',
  Write: 'Write',
  Owner: 'Owner'
};

function getPermission(permissions) {
  const newPermissions = [];
  if (permissions.includes(permissionOptions.Owner.toUpperCase())) return [permissionOptions.Owner];
  if (permissions.includes(permissionOptions.Write.toUpperCase())) newPermissions.push(permissionOptions.Write);
  if (permissions.includes(permissionOptions.Read.toUpperCase())) newPermissions.push(permissionOptions.Read);
  if (permissions.includes(permissionOptions.Link.toUpperCase())) newPermissions.push(permissionOptions.Link);
  if (permissions.includes(permissionOptions.Discover.toUpperCase())) newPermissions.push(permissionOptions.Discover);
  return newPermissions;
}

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.LOAD_ENTITY_SET:
      return state.merge({
        entitySet: action.entitySet
      });

    case actionTypes.INITIAL_LOAD:
      return state.merge({
        entitySetId: action.id
      });

    case actionTypes.SET_ENTITY_SET:
      return state.merge({
        entitySet: action.entitySet
      });

    case actionTypes.RESET_PERMISSIONS:
      return INITIAL_STATE;

    case permissionsActionTypes.GET_ACL_SUCCESS:
      return state.merge({
        acl: action.acl
      });

    case actionTypes.SET_ALL_USERS_AND_ROLES:
      return state.merge({
        allUsersById: action.users,
        allRolesList: action.roles
      });

    case actionTypes.SET_LOAD_USERS_ERROR:
      return state.merge({
        loadUsersError: action.bool
      });

    case actionTypes.SET_NEW_ROLE_VALUE:
      return state.merge({
        newRoleValue: action.value
      });

    case actionTypes.SET_NEW_EMAIL_VALUE:
      return state.merge({
        newEmailValue: action.value
      });

    case actionTypes.SET_UPDATE_SUCCESS:
      return state.merge({
        updateSuccess: action.bool
      });

    case actionTypes.SET_UPDATE_ERROR:
      return state.merge({
        updateError: action.bool
      });

    case actionTypes.SET_ENTITY_DATA:
      return state.merge({
        roleAcls: action.data.roleAcls,
        userAcls: action.data.userAcls,
        globalValue: action.data.globalValue
      });

    case actionTypes.SET_ENTITY_GLOBAL_VALUE:
      return state.merge({
        globalValue: action.data
      });

    case actionTypes.SET_USER_PERMISSIONS: {
      const { userAcls, roleAcls, globalValue } = action.data;
      const allUsersById = state.get('allUsersById').toJS();
      const userPermissions = [];

      Object.keys(allUsersById).forEach((userId) => {
        if (userId && allUsersById[userId]) {
          const user = {
            id: userId,
            nickname: allUsersById[userId].nickname,
            email: allUsersById[userId].email,
            roles: [],
            permissions: [],
            individualPermissions: []
          };

          // Get all user permissions (sum of individual + roles + default);
          Object.keys(userAcls).forEach((permissionKey) => {
            if (userAcls[permissionKey].indexOf(userId) !== -1) {
              user.permissions.push(permissionKey);
              // Save individual permissions separately
              user.individualPermissions.push(permissionKey);
            }
          });

          // Add additional permissions based on the roles the user has
          if (allUsersById[userId].roles.length > 1) {
            Object.keys(roleAcls).forEach((permissionKey) => {
              allUsersById[userId].roles.forEach((role) => {
                if (roleAcls[permissionKey].indexOf(role) !== -1 && user.permissions.indexOf(permissionKey) === -1) {
                  user.permissions.push(permissionKey);
                }
                if (user.roles.indexOf(role) === -1 && role !== 'AuthenticatedUser') {
                  user.roles.push(role);
                }
              });
            });
          }

          // Add additional permissions based on default for all users
          if (globalValue) {
            globalValue.forEach((permission) => {
              if (user.permissions.indexOf(permission) === -1) {
                user.permissions.push(permission);
              }
            });
          }
          userPermissions.push(user);
        }
      });

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

    case actionTypes.SET_ROLE_PERMISSIONS: {
      const { roleAcls, globalValue } = action.data;
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
      rolePermissions.AuthenticatedUser = globalValue;

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

    case actionTypes.SET_PROPERTY_DATA: {
      const propertyDataMerge = {
        properties: {
          [action.data.id]: {
            title: action.data.title,
            roleAcls: action.data.roleAcls,
            userAcls: action.data.userAcls,
            globalValue: action.data.globalValue
          }
        }
      };
      return state.mergeDeep(propertyDataMerge);
    }

    case actionTypes.SET_PROPERTY_GLOBAL_VALUE: {
      const propertyGVMerge = {
        properties: {
          [action.data.id]: {
            globalValue: action.data
          }
        }
      };
      return state.mergeDeep(propertyGVMerge);
    }

    default:
      return state;
  }
}
