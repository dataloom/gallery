/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './EntitySetDetailActionTypes';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

export const INITIAL_STATE:Immutable.Map<*,*> = Immutable.fromJS({
  asyncState: {
    status: ASYNC_STATUS.LOADING,
    errorMessage: ''
  }
});

export default function reducer(state:Immutable.Map<*,*> = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case actionTypes.ENTITY_SET_REQUEST:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });

    case actionTypes.ENTITY_SET_REJECT:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.ENTITY_SET_RESOLVE:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        },
        entitySetId: action.entitySetId
      });

    default:
      return state
  }
}
