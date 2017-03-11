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
  allUsersById: {},
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
    case actionTypes.SET_ALL_USERS_BY_ID:
      return state.merge({
        allUsersById: action.data
      })
    case actionTypes.SET_ENTITY_DATA:
      return state.merge({
        roleAcls: action.data.roleAcls,
        userAcls: action.data.userAcls
      })
    case actionTypes.SET_PROPERTY_DATA:
      var stateJS = state.toJS();
      var nestedState = {...stateJS,
        properties: {
          ...stateJS.properties,
          [action.data.id]: {
            title: action.data.title,
            roleAcls: action.data.roleAcls,
            userAcls: action.data.userAcls
          }
        }
      };
      var immutableNestedState = Immutable.fromJS(nestedState);
      return immutableNestedState;

      // TODO: REWORK TO USE GET/SET/MERGE IMMUTABLE METHODS...
      // TRY WITH {} AROUND MERGE OBJECT
      // const property = {
      //   title: action.data.title,
      //   roleAcls: action.data.roleAcls,
      //   userAcls: action.data.userAcls
      // };
      // const properties = state.get('properties');
      // const newProperties = properties.set(action.data.id, property);
      //TODO: MERGE PROPERLY W/ STATE

    default:
      return state;
  }
}
