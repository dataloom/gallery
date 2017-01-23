/* @flow */
import {
  LOAD_PRINCIPAL_DETAILS,

} from './PrincipalsActionTypes';

export function loadPrincipalDetails(id :string) {
  return {
    type: LOAD_PRINCIPAL_DETAILS,
    id
  }
}

export default {
  loadPrincipalDetails
}