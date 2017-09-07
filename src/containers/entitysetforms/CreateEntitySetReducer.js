/* @flow */
import Immutable from 'immutable';

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import * as actionTypes from './CreateEntitySetActionTypes';
import * as edmActionTypes from '../edm/EdmActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entityTypesAsyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  },
  entityTypeReferences: [],
  createEntitySetAsyncState: {
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  }
});

export default function reducer(state:Immutable.Map = INITIAL_STATE, action:Object) {
  switch (action.type) {
    case edmActionTypes.ALL_ENTITY_TYPES_REQUEST:
      return state.merge({
        entityTypesAsyncState: {
          status: ASYNC_STATUS.LOADING,
            errorMessage: ''
        },
        entityTypeReferences: []
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

    case actionTypes.CREATE_ENTITY_SET_REQUEST:
    case actionTypes.CREATE_LINKED_ENTITY_SET_REQUEST:
      return state.merge({
        createEntitySetAsyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }
      });
    case actionTypes.CREATE_ENTITY_SET_REJECT:
    case actionTypes.CREATE_LINKED_ENTITY_SET_REJECT:
      return state.merge({
        createEntitySetAsyncState: {
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }
      });
    case actionTypes.CREATE_ENTITY_SET_RESOLVE:
    case actionTypes.CREATE_LINKED_ENTITY_SET_RESOLVE:
      return state.merge({
        createEntitySetAsyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }
      });
    case actionTypes.CREATE_ENTITY_SET_RESET:
      return state.merge({
        createEntitySetAsyncState: {
          status: ASYNC_STATUS.PENDING,
          errorMessage: ''
        }
      });

    default:
      return state;
  }
}
