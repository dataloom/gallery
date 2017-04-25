/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './TopUtilizersActionTypes';
import * as ESDActionTypes from '../entitysetdetail/EntitySetDetailActionTypes';

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
      return state;

    case actionTypes.GET_ASSOCIATIONS_SUCCESS:
      return state.set('associations', action.data);

    case actionTypes.GET_ASSOCIATIONS_FAILURE:
      return state;

    case actionTypes.GET_ENTITY_TYPES_SUCCESS:
      return state.set('entityTypes', action.data);

    case actionTypes.GET_ENTITY_TYPES_FAILURE:
      return state;

    case ESDActionTypes.ENTITY_SET_REQUEST:
      return state.set('entitySetId', action.id);

    case actionTypes.SET_ENTITY_SET:
      return state.set('entitySet', action.data);

    case actionTypes.ON_ENTITY_SELECT: {
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
    }

    case actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST:
      return state.set('isGettingResults', true);

    case actionTypes.SUBMIT_TOP_UTILIZERS_SUCCESS: {
      const newState = {
        isGettingResults: false,
        topUtilizersResults: action.data
      };
      return state.merge(newState);
    }

    case actionTypes.SUBMIT_TOP_UTILIZERS_FAILURE:
      return state.set('isGettingResults', false);

    default:
      return state;
  }
}
