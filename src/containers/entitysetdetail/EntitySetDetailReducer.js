/* @flow */
import Immutable from 'immutable';

import * as AsyncActionTypes from '../async/AsyncActionTypes';
import * as actionTypes from './EntitySetDetailActionTypes';
// import * as edmActionTypes from '../edm/EdmActionTypes';

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  asyncState: {
    status: ASYNC_STATUS.LOADING,
    errorMessage: ''
  },
  // TODO: Move to object reference
  entitySetId: null,
  entitySetReference: {},
  entitySet: {},
  size: null
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {
    case actionTypes.ENTITY_SET_REQUEST:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }))
        .set('entitySetId', action.id)
        .set('entitySetReference', {});

    // case actionTypes.SET_ENTITY_SET:
    //   return state.set('entitySet', Immutable.fromJS(action.data));

    // TODO: Handle error case
    // case edmActionTypes.EDM_OBJECT_RESOLVE:
    //   if (state.get('entitySetId') !== action.reference.id) {
    //     return state;
    //   }
    //
    //   return state.merge({
    //     asyncState: {
    //       status: ASYNC_STATUS.SUCCESS,
    //       errorMessage: ''
    //     },
    //     entitySetReference: action.reference
    //   });

    // !!! HACK !!!
    case AsyncActionTypes.UPDATE_ASYNC_REFERENCE: {

      if (state.get('entitySetId') !== action.reference.id || action.reference.namespace !== 'entitySets') {
        return state;
      }

      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }))
        .set('entitySetReference', action.reference);
    }

    case actionTypes.GET_ENTITY_SET_SIZE_SUCCESS:
      return state.set('size', action.size);

    case actionTypes.GET_ENTITY_SET_SIZE_REQUEST:
    case actionTypes.GET_ENTITY_SET_SIZE_FAILURE:
      return state.set('size', null);

    default:
      return state;
  }
}
