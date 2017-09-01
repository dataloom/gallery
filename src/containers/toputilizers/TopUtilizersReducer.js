/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './TopUtilizersActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entitySet: {},
  associations: [],
  topUtilizersDetailsList: [{}],
  topUtilizersResults: Immutable.List(),
  isGettingResults: false,
  associationDetails: Immutable.Map(),
  neighbors: Immutable.Map()
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case actionTypes.GET_ENTITY_SET_SUCCESS:
      return state.set('entitySet', action.entitySet);

    case actionTypes.GET_ASSOCIATIONS_SUCCESS: {
      const associations = Immutable.fromJS(action.data);
      return state.set('associations', associations);
    }

    case actionTypes.GET_ASSOCIATIONS_FAILURE:
      return state;

    case actionTypes.GET_ASSOCIATION_DETAILS_SUCCESS:
      return state.setIn(['associationDetails', action.associationId], action.associationDetails);

    case actionTypes.SET_ENTITY_SET:
      return state.set('entitySet', action.data);

    case actionTypes.ON_ENTITY_SELECT: {
      const { selectedAssociation, selectedArrow, selectedEntities } = action.data;
      const neighborTypeIds = selectedEntities.map((entity) => {
        return entity.value;
      });
      const details = {
        associationTypeId: selectedAssociation.value,
        neighborTypeIds,
        utilizerIsSrc: selectedArrow.value
      };
      const updatedList = state.get('topUtilizersDetailsList').set(action.rowNum, Immutable.fromJS(details));
      return state.set('topUtilizersDetailsList', updatedList);
    }

    case actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST:
      return state.set('isGettingResults', true)
        .set('topUtilizersResults', Immutable.List())
        .set('neighbors', Immutable.Map());

    case actionTypes.SUBMIT_TOP_UTILIZERS_SUCCESS: {
      const newState = {
        isGettingResults: false,
        topUtilizersResults: action.data
      };
      return state.merge(newState);
    }

    case actionTypes.SUBMIT_TOP_UTILIZERS_FAILURE:
      return state.set('isGettingResults', false);

    case actionTypes.GET_TOP_UTILIZERS_NEIGHBORS_SUCCESS:
      return state.set('neighbors', Immutable.fromJS(action.neighbors));

    case actionTypes.ADD_DETAILS_ROW: {
      const newList = state.get('topUtilizersDetailsList').push(Immutable.Map());
      return state.set('topUtilizersDetailsList', newList);
    }

    case actionTypes.REMOVE_DETAILS_ROW: {
      const newList = state.get('topUtilizersDetailsList').delete(action.deleteIndex);
      return state.set('topUtilizersDetailsList', newList);
    }

    default:
      return state;
  }
}
