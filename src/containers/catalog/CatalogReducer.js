/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './CatalogActionTypes';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

// TODO: Switch to references
export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  asyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  entitySetIds: [],
  popularEntitySetReferences: []
});

export default function reducer(state:Immutable.Map<*, *> = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case actionTypes.CATALOG_SEARCH_REQUEST:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        },
        entitySetIds: []
      });

    case actionTypes.CATALOG_SEARCH_REJECT:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.CATALOG_SEARCH_RESOLVE:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        },
        entitySetIds: action.entitySetIds,
        numHits: action.numHits
      });

    case actionTypes.POPULAR_ENTITY_SETS_REQUEST:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        },
        popularEntitySetReferences: []
      });

    case actionTypes.POPULAR_ENTITY_SETS_REJECT:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        },
        popularEntitySetReferences: []
      });

    case actionTypes.POPULAR_ENTITY_SETS_RESOLVE:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        },
        popularEntitySetReferences: action.references
      });

    default:
      return state;
  }
}
