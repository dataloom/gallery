import Immutable from 'immutable';

import * as actionTypes from './PermissionsPanelActionTypes';
import * as permissionActionTypes from '../permissions/PermissionsActionTypes';

import {
  ORGANIZATION,
  USER,
  ROLE
} from '../../utils/Consts/UserRoleConsts';

export const LOADING_ERROR = Symbol('loading error');

const DEFAULT_ACLS = { DISCOVER: [], LINK: [], READ: [], WRITE: [], OWNER: [] };
const DEFAULT_ORG_ACLS = { MATERIALIZE: [] };

const INITIAL_STATE = Immutable.fromJS({
  users: Immutable.Map(),
  roles: Immutable.Map(),
  permissions: Immutable.Map(),
  aclKeyPermissions: Immutable.Map(),
  loadUsersError: '',
  loadRolesError: ''
});

export default function reducer(state = INITIAL_STATE, action) {

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
      let userAcls = Immutable.fromJS(DEFAULT_ACLS);
      let roleAcls = Immutable.fromJS(DEFAULT_ACLS);
      let orgAcls = Immutable.fromJS(DEFAULT_ORG_ACLS);

      action.acl.aces.forEach((ace) => {
        const id = ace.principal.id;
        ace.permissions.forEach((permission) => {
          switch (ace.principal.type) {
            case USER:
              userAcls = userAcls.set(permission, userAcls.get(permission, Immutable.List()).push(id));
              break;

            case ROLE:
              roleAcls = roleAcls.set(permission, roleAcls.get(permission, Immutable.List()).push(id));
              break;

            case ORGANIZATION:
              orgAcls = orgAcls.set(permission, orgAcls.get(permission, Immutable.List()).push(id));
              break;

            default:
              break;
          }
        });
      });

      return state
        .set('permissions', state.get('permissions')
        .set(Immutable.fromJS(action.aclKey), Immutable.fromJS(action.acl)))
        .setIn(['aclKeyPermissions', Immutable.fromJS(action.aclKey), USER], userAcls)
        .setIn(['aclKeyPermissions', Immutable.fromJS(action.aclKey), ROLE], roleAcls)
        .setIn(['aclKeyPermissions', Immutable.fromJS(action.aclKey), ORGANIZATION], orgAcls);
    }

    case actionTypes.GET_ALL_USERS_FAILURE:
      return state.set('loadUsersError', action.errorMessage);

    case actionTypes.GET_ALL_ROLES_FAILURE:
      return state.set('loadRolesError', action.errorMessage);

    default:
      return state;
  }
}
