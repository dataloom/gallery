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
  entitySetIds: Immutable.List(),
  numHits: 0
});

export default function reducer(state :Map<> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case actionTypes.CATALOG_SEARCH_REQUEST:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }))
        .set('entitySetIds', Immutable.List())
        .set('numHits', 0);

    case actionTypes.CATALOG_SEARCH_REJECT:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }))
        .set('entitySetIds', Immutable.List())
        .set('numHits', 0);

    case actionTypes.CATALOG_SEARCH_RESOLVE:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }))
        .set('entitySetIds', Immutable.fromJS(action.entitySetIds))
        .set('numHits', action.numHits);

    case actionTypes.CATALOG_CLEAR:
      return INITIAL_STATE;

    default:
      return state;
  }
}
