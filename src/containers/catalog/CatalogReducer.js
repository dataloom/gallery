/* @flow */
import * as actionTypes from './CatalogActionTypes';
import Immutable from 'immutable';

export const INITIAL_STATE = Immutable.fromJS({
  asyncState: {
    isLoading: true,
    errorMessage: ''
  },
  entitySets: [],
  filterParams: {
    keyword: '',
    propertyTypeIds: [],
    entityTypeId: ''
  }
});

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.ENTITY_SET_LIST_REQUEST:
      return state.merge({
        asyncState: {
          isLoading: true,
          errorMessage: ''
        },
        entitySets: []
      });

    case actionTypes.ENTITY_SET_LIST_FAILURE:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: action.errorMessage
        },
        entitySets: []
      });

    case actionTypes.ENTITY_SET_LIST_SUCCESS:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: ''
        },
        entitySets: action.entitySets
      });

    case actionTypes.CATALOG_UPDATE_FILTER:
      return state.set('filterParams', Immutable.fromJS(action.filterParams));

    default:
      return state
  }
}