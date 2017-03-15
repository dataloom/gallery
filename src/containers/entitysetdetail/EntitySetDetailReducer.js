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
  allUsersById: {}, // check it's an object
  allRolesList: [],
  loadUsersError: false,
  roleAcls: {},
  userAcls: {},
  globalValue: [],
  properties: {},
  newRoleValue: '',
  newEmailValue: '',
  updateSuccess: false,
  updateError: false
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

    case actionTypes.SET_ALL_USERS_AND_ROLES:
      return state.merge({
        allUsersById: action.users,
        allRolesList: action.roles
      });

    case actionTypes.SET_LOAD_USERS_ERROR:
      return state.merge({
        loadUsersError: action.bool
      });

    case actionTypes.SET_NEW_ROLE_VALUE:
      return state.merge({
        newRoleValue: action.value
      });

    case actionTypes.SET_NEW_EMAIL_VALUE:
      return state.merge({
        newEmailValue: action.value
      });

    case actionTypes.SET_ENTITY_DATA:
      return state.merge({
        roleAcls: action.data.roleAcls,
        userAcls: action.data.userAcls,
        globalValue: action.data.globalValue
      });

    case actionTypes.SET_UPDATE_SUCCESS:
      return state.merge({
        updateSuccess: action.bool
      });

    case actionTypes.SET_UPDATE_ERROR:
      return state.merge({
        updateError: action.bool
      });

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

    default:
      return state;
  }
}
