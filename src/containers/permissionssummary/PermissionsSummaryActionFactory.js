import { newRequestSequence } from 'redux-reqseq';

import * as actionTypes from './PermissionsSummaryActionTypes';

export function initialLoad(entitySet) {
  return {
    type: actionTypes.INITIAL_LOAD,
    entitySet
  };
}

export function loadEntitySet(entitySet) {
  return {
    type: actionTypes.LOAD_ENTITY_SET,
    entitySet
  };
}

export function resetPermissions() {
  return {
    type: actionTypes.RESET_PERMISSIONS
  };
}

export const GET_ROLES_FOR_USERS :string = 'GET_ROLES_FOR_USERS';
export const getRolesForUsers :RequestSequence = newRequestSequence(GET_ROLES_FOR_USERS);
