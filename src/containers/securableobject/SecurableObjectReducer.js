/* @flow */
import Immutable from 'immutable';

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import * as edmActionTypes from '../edm/EdmActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entityTypesAsyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  entityTypeReferences: []
});

export default function reducer(state:Immutable.Map = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case edmActionTypes.ALL_ENTITY_TYPES_REQUEST:
      return state.merge({
        entityTypesAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        },
        entityTypeIds: []
      });
    case edmActionTypes.ALL_ENTITY_TYPES_REJECT:
      return state.merge({
        entityTypesAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });
    case edmActionTypes.ALL_ENTITY_TYPES_RESOLVE:
      return state.merge({
        entityTypesAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        },
        entityTypeReferences: action.references
      });

    default:
      return state;
  }
}