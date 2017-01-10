/* @flow */
import * as actionTypes from './CatalogActionTypes';

export const INITIAL_STATE = {
  asyncState: {
    isLoading: true,
    errorMessage: ""
  },
  entitySets: []
};

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.ENTITY_SET_LIST_REQUEST:
      return Object.assign({}, state, {
        asyncState: {
          isLoading: true,
          errorMessage: ""
        },
        entitySets: []
      });
      break;

    case actionTypes.ENTITY_SET_LIST_FAILURE:
      return Object.assign({}, state, {
        asyncState: {
          isLoading: false,
          errorMessage: action.errorMessage
        },
        entitySets: []
      });
      break;

    case actionTypes.ENTITY_SET_LIST_SUCCESS:
      return Object.assign({}, state, {
        asyncState: {
          isLoading: false,
          errorMessage: ""
        },
        entitySets: action.entitySets
      });
      break;

    default:
      return state
  }
}