import Immutable from 'immutable';
import * as actionTypes from './PermissionsSummaryActionTypes';
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

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.RESET_PERMISSIONS:
      return INITIAL_STATE;

    case actionTypes.LOAD_ACLS_SUCCESS:
      // do something
      return state.merge({
        acl: action.acl
      })

    case actionTypes.LOAD_ACLS_FAILURE:
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
