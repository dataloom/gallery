/* @flow */
import {
  LOAD_PRINCIPAL_DETAILS,
  LOAD_ALL_USERS
} from './PrincipalsActionTypes';

export function loadPrincipalDetails(id :string) {
  return {
    type: LOAD_PRINCIPAL_DETAILS,
    id
  }
}

export function loadAllUsers() {
  return {
    type: LOAD_ALL_USERS
  }
}


export default {
  loadPrincipalDetails,
  loadAllUsers
}