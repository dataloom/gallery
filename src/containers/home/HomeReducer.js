/*
 * @flow
 */

import Immutable from 'immutable';

import * as HomeActionTypes from './HomeActionTypes';

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

export const INITIAL_STATE :Map<> = Immutable.fromJS({

  // legacy
  asyncState: Immutable.fromJS({
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  }),
  entitySetIds: Immutable.List(),
  numHits: 0
});

export default function reducer(state :Map<> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case HomeActionTypes.HOME_ENTITY_SETS_REQUEST: {
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }))
        .set('entitySetIds', Immutable.List());
    }

    case HomeActionTypes.HOME_ENTITY_SETS_SUCCESS:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }))
        .set('entitySetIds', Immutable.fromJS(action.entitySetIds))
        .set('numHits', action.numHits);

    case HomeActionTypes.HOME_ENTITY_SETS_FAILURE:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }))
        .set('entitySetIds', Immutable.List())
        .set('numHits', 0);

    default:
      return state;
  }
}
