import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
import * as psActionFactory from './PermissionsSummaryActionFactory';
import * as permissionsActionTypes from '../permissions/permissionsActionTypes';
import { ROLE, AUTHENTICATED_USER } from '../../utils/Consts/UserRoleConsts';

// import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  allUsersById: {}, // check it's an object
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
      // QUESTION: chain success -> action call in the observable or context where request is called, OR design separate epic w/ api call

    case actionTypes.UPDATE_ACLS_REQUEST:
    // TODO: Refactor into helper function(s)
      const property = action.property || null; // TODO: get property from action or acl?
      let globalValue = [];
      const roleAcls = { Discover: [], Link: [], Read: [], Write: [] };
      const userAcls = { Discover: [], Link: [], Read: [], Write: [], Owner: [] };
      action.aces.forEach((ace) => {
        if (ace.permissions.length > 0) {
          if (ace.principal.type === ROLE) {
            if (ace.principal.id === AUTHENTICATED_USER) {
              // TODO: define getPermissions somewhere in here
              globalValue = getPermission(ace.permissions);
            }
            else {
              getPermission(ace.permissions).forEach((permission) => {
                roleAcls[permission].push(ace.principal.id);
              });
            }
          }
          else {
            getPermission(ace.permissions).forEach((permission) => {
              userAcls[permission].push(ace.principal.id);
            });
          }
        }
      });
      if (property) {
        state.merge({
          newRoleValue: '',
          newEmailValue: '',
          updateError: false
        });
        const propertyDataMerge = {
          properties: {
            [property.id]: {
              title: property.title,
              roleAcls,
              userAcls,
              globalValue
            }
          }
        };
        return state.mergeDeep(propertyDataMerge);
        // TODO: SEE IF BELOW CODE WORKS BETTER THAN ABOVE (in case 2 state merges before returnint doesn't work -> single merge)
        // const propertyData = {
        //   [property.id]: {
        //     title: property.title,
        //     roleAcls,
        //     userAcls,
        //     globalValue
        //   }
        // };
        // const newPropertyState = state.get('properties').merge(propertyData);
        // state.merge({
        //   newRoleValue: '',
        //   newEmailValue: '',
        //   updateError: false,
        //   properties: newPropertyState
        // });
      }
      return state.merge({
        newRoleValue: '',
        newEmailValue: '',
        updateError: false,
        roleAcls,
        userAcls,
        globalValue
      });

    case actionTypes.UPDATE_ACLS_SUCCESS:
      console.log('hit update state acls success:', action);

    case actionTypes.UPDATE_ACLS_FAILURE:
      // do something else

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

    case actionTypes.SET_ENTITY_USER_PERMISSIONS:
      return state.merge({
        entityUserPermissions: action.data
      });

    case actionTypes.SET_ENTITY_ROLE_PERMISSIONS:
      return state.merge({
        entityRolePermissions: action.data
      });

    case actionTypes.SET_PROPERTY_USER_PERMISSIONS: {
      const userPermissionsMerge = {
        propertyPermissions: {
          [action.property.title]: {
            userPermissions: action.permissions
          }
        }
      };
      return state.mergeDeep(userPermissionsMerge);
    }

    case actionTypes.SET_PROPERTY_ROLE_PERMISSIONS: {
      const rolePermissionsMerge = {
        propertyPermissions: {
          [action.property.title]: {
            rolePermissions: action.permissions
          }
        }
      };
      return state.mergeDeep(rolePermissionsMerge);
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
