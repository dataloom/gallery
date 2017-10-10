/*
 * @flow
 */

import Immutable from 'immutable';

import * as actionTypes from './CatalogActionTypes';

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

// TODO: Switch to references
export const INITIAL_STATE :Map<> = Immutable.fromJS({
  asyncState: Immutable.fromJS({
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  }),
  entitySetIds: Immutable.List()
});

export default function reducer(state :Map<> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case actionTypes.CATALOG_SEARCH_REQUEST:
      return state.mergeDeep({
        asyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        },
        entitySetIds: []
      });

    case actionTypes.CATALOG_SEARCH_REJECT:
      return state.mergeDeep({
        asyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.CATALOG_SEARCH_RESOLVE:
      return state.mergeDeep({
        asyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        },
        entitySetIds: Immutable.fromJS(action.entitySetIds),
        numHits: action.numHits
      });

    default:
      return state;
  }
}
