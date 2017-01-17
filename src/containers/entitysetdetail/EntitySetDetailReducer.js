/* @flow */
import * as actionTypes from './EntitySetDetailActionTypes';
import Immutable from 'immutable';

export const INITIAL_STATE:Immutable.Map<*,*> = Immutable.fromJS({
  asyncState: {
    isLoading: true,
    errorMessage: ''
  }
});

export default function reducer(state:Immutable.Map<*,*> = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case actionTypes.ENTITY_SET_REQUEST:
      return state.merge({
        asyncState: {
          isLoading: true,
          errorMessage: ''
        }
      });

    case actionTypes.ENTITY_SET_REJECT:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: action.errorMessage
        }
      });

    case actionTypes.ENTITY_SET_RESOLVE:
      return state.merge({
        asyncState: {
          isLoading: false,
          errorMessage: ''
        },
        entitySetId: action.entitySetId
      });

    default:
      return state
  }
}
