/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './TopUtilizersActionTypes';
import * as ESDActionTypes from '../entitysetdetail/EntitySetDetailActionTypes';
import * as EdmActionTypes from '../edm/EdmActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entitySetId: null,
  entitySet: null,
  associations: [],
  entityTypes: [],
  topUtilizersDetailsList: {},
  topUtilizersResults: [],
  isGettingResults: false
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case actionTypes.GET_ENTITY_TYPES_REQUEST:
      console.log('entity types REQUEST:', action);
      return state;

    case actionTypes.GET_ASSOCIATIONS_SUCCESS:
      console.log('entity types sucess:', action);
      return state.set('associations', action.data);

    case actionTypes.GET_ASSOCIATIONS_FAILURE:
      console.log('entity types failure:', action.err);
      return state;

    case actionTypes.GET_ENTITY_TYPES_SUCCESS:
      console.log('entity types sucess:', action);
      return state.set('associations', action.data);

    case actionTypes.GET_ENTITY_TYPES_FAILURE:
      console.log('entity types failure:', action.err);
      return state;

    case ESDActionTypes.ENTITY_SET_REQUEST:
      return state.set('entitySetId', action.id);

    case actionTypes.SET_ENTITY_SETS:
      console.log('set entity sets:', action);
      return state.set('entityTypes', action.data);

    case actionTypes.SET_ENTITY_SET:
      console.log('set entity set:', action);
      return state.set('entitySet', action.data);

    case actionTypes.ON_ENTITY_SELECT:
      console.log('entity select action:', action);
      const { selectedAssociation, selectedArrow, selectedEntities } = action.data;
      const neighborTypeIds = selectedEntities.map((entity) => {
        return entity.value;
      });
      const mergeObj = {
        topUtilizersDetailsList: {
          [selectedAssociation.value]: {
            associationTypeId: selectedAssociation.value,
            neighborTypeIds,
            utilizerIsSrc: selectedArrow.value
          }
        }
      };
      return state.mergeDeep(mergeObj);

    case actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST:
      console.log('submit action:', action);
      return state.set('isGettingResults', true);

    case actionTypes.SUBMIT_TOP_UTILIZERS_SUCCESS:
      console.log('submit SUCCESS:', action);
      const newState = {
        isGettingResults: false,
        topUtilizersResults: action.data
      }
      return state.merge(newState);

    case actionTypes.SUBMIT_TOP_UTILIZERS_FAILURE:
      console.log('submit failure:', action);
      return state.set('isGettingResults', false);

    default:
      return state;
  }
}
