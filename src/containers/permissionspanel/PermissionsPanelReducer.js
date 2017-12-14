/* @flow */
import Immutable, { Map, fromJS } from 'immutable';

import * as actionTypes from './PermissionsPanelActionTypes';
import * as permissionActionTypes from '../permissions/PermissionsActionTypes';

import {
  USER,
  ROLE
} from '../../utils/Consts/UserRoleConsts';

export const LOADING_ERROR = Symbol('loading error');

const DEFAULT_USER_ACLS = fromJS({ DISCOVER: [], LINK: [], READ: [], WRITE: [], OWNER: [] });
const DEFAULT_ROLE_ACLS = fromJS({ DISCOVER: [], LINK: [], READ: [], WRITE: [] });

const INITIAL_STATE:Map<*, *> = fromJS({
  users: Immutable.Map(),
  roles: Immutable.Map(),
  permissions: Immutable.Map(),
  aclKeyPermissions: Immutable.Map(),
  loadUsersError: '',
  loadRolesError: ''
});

export default function reducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {
    case actionTypes.GET_ALL_USERS_SUCCESS:
      return state
        .set('users', Immutable.fromJS(action.users))
        .set('loadUsersError', '');

    case actionTypes.GET_ALL_ROLES_SUCCESS:
      return state
        .set('roles', Immutable.fromJS(action.roles))
        .set('loadRolesError', '');

    case permissionActionTypes.GET_ACL_SUCCESS: {
      let userAcls = DEFAULT_USER_ACLS;
      let roleAcls = DEFAULT_ROLE_ACLS;

      action.acl.aces.forEach((ace) => {
        const id = ace.principal.id;
        ace.permissions.forEach((permission) => {
          if (ace.principal.type === USER) {
            userAcls = userAcls.set(permission, userAcls.get(permission).push(id));
          }
          else if (ace.principal.type === ROLE) {
            roleAcls = roleAcls.set(permission, roleAcls.get(permission).push(id));
          }
        });
      });

      const newState = state
         .set('permissions', state.get('permissions')
           .set(Immutable.fromJS(action.aclKey), Immutable.fromJS(action.acl)))
         .setIn(['aclKeyPermissions', Immutable.fromJS(action.aclKey), USER], userAcls)
         .setIn(['aclKeyPermissions', Immutable.fromJS(action.aclKey), ROLE], roleAcls);

      return newState;
    }

    case actionTypes.GET_ALL_USERS_FAILURE:
      return state.set('loadUsersError', action.errorMessage);

    case actionTypes.GET_ALL_ROLES_FAILURE:
      return state.set('loadRolesError', action.errorMessage);

    default:
      return state;
  }
}
