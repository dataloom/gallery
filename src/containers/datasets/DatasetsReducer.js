/* @flow */
import Immutable, { Map, fromJS } from 'immutable';

import * as actionTypes from './DatasetsActionTypes';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent'

export const LOADING_ERROR = Symbol('loading error');

/*
 * Note: the first paging token is null, which is why allPagingTokens contains a
 * value of null. To load a page of entity set ids that you own, you must include
 * a paging token in your request, and the response will include the next paging
 * token. Subsequent paging tokens will be strings, and if null is returned, you
 * have reached the last page.
 */
const INITIAL_STATE:Map<*, *> = fromJS({
  asyncStatus: ASYNC_STATUS.PENDING,
  authorizedObjects: Immutable.List(),
  pagingToken: null,
  entitySets: Immutable.List(),
  finishedLoading: false,
  errorMessage: '',
  allPagingTokens: Immutable.List.of(null)
});

export default function reducer(state:Map<*, *> = INITIAL_STATE, action:Object) {

  switch (action.type) {
    case actionTypes.GET_OWNED_DATASETS_IDS_REQUEST:
      return state.set('asyncStatus', ASYNC_STATUS.LOADING);

    case actionTypes.GET_OWNED_DATASETS_IDS_REJECT:
    case actionTypes.GET_OWNED_DATASETS_DETAILS_REJECT:
      return state
        .set('asyncStatus', ASYNC_STATUS.ERROR)
        .set('errorMessage', action.errorMessage);

    case actionTypes.GET_OWNED_DATASETS_DETAILS_RESOLVE: {
      const newState = state
        .set('pagingToken', action.pagingToken)
        .set('entitySets', action.ownedDatasets)
        .set('asyncStatus', ASYNC_STATUS.SUCCESS)
        .set('finishedLoading', !action.pagingToken);
      if (!state.get('allPagingTokens').includes(action.pagingToken)) {
        return newState.set('allPagingTokens', state.get('allPagingTokens').push(action.pagingToken));
      }
      return newState;
    }

    case actionTypes.RESET_DATASETS_PAGE:
      return INITIAL_STATE;

    default:
      return state;
  }
}
