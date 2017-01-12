/* @flow */
import * as actionTypes from './CatalogActionTypes';
import Immutable from 'immutable';

export const INITIAL_STATE = Immutable.fromJS({
  asyncState: {
    isLoading: true,
    errorMessage: ''
  },
  filterParams: {
    keyword: '',
    propertyTypeIds: [],
    entityTypeId: ''
  },
  normalizedData: {},
  entitySetIds: []
});

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.CATALOG_SEARCH_REQUEST:
      return state.merge({
        asyncState: {
          isLoading: true,
          errorMessage: ''
        }
      });

    case actionTypes.CATALOG_SEARCH_REJECT:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.CATALOG_SEARCH_RESOLVE:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: ''
        },
        normalizedData: state.get('normalizedData').merge(action.normalizedData),
        entitySetIds: action.entitySetIds
      });

    case actionTypes.CATALOG_UPDATE_FILTER:
      return state.set('filterParams', Immutable.fromJS(action.filterParams));

    default:
      return state
  }
}