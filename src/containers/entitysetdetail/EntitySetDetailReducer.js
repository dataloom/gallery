/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './EntitySetDetailActionTypes';
import * as edmActionTypes from '../edm/EdmActionTypes';
import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  asyncState: {
    status: ASYNC_STATUS.LOADING,
    errorMessage: ''
  },
  // TODO: Move to object reference
  entitySetId: null,
  entitySetReference: null,
  properties: {}
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case actionTypes.ENTITY_SET_REQUEST:
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        },
        // Reference
        entitySetId: action.id,
        entitySetReference: null
      });
    // TODO: Handle error case
    case edmActionTypes.EDM_OBJECT_RESOLVE:
      if (state.get('entitySetId') !== action.reference.id) {
        return state;
      }
      return state.merge({
        asyncState: {
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        },
        entitySetReference: action.reference
      });
    case actionTypes.SET_PROPERTY_DATA:
      const newState = { ...state,
        properties: {
          ...state.properties,
          [action.data.id]: {
            title: action.data.title,
            roleAcls: action.data.roleAcls,
            userAcls: action.data.userAcls
          }
        }
      };
      console.log('newState:', newState);
    default:
      return state;
  }
}
