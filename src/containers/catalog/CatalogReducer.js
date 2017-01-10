/* @flow */
import * as actionTypes from './CatalogActionTypes';
import Immutable from 'immutable';

export const INITIAL_STATE = Immutable.fromJS({
  asyncState: {
    isLoading: true,
    errorMessage: ''
  },
  entitySets: []
});

export function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.ENTITY_SET_LIST_REQUEST:
      return state.merge({
        asyncState: {
          isLoading: true,
          errorMessage: ''
        },
        entitySets: []
      });
      break;

    case actionTypes.ENTITY_SET_LIST_FAILURE:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: action.errorMessage
        },
        entitySets: []
      });
      break;

    case actionTypes.ENTITY_SET_LIST_SUCCESS:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: ''
        },
        entitySets: action.entitySets
      });
      break;

    default:
      return state
  }
}