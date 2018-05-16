import Immutable from 'immutable';

import * as actionTypes from './TopUtilizersActionTypes';

export const INITIAL_STATE = Immutable.fromJS({
  entitySet: {},
  topUtilizersDetailsList: Immutable.List(),
  topUtilizersResults: Immutable.List(),
  isGettingResults: false,
  isGettingNeighbors: false,
  neighbors: Immutable.Map(),
  neighborTypes: Immutable.List()
});

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {

    case actionTypes.GET_ENTITY_SET_SUCCESS:
      return state.set('entitySet', action.entitySet);

    case actionTypes.SET_ENTITY_SET:
      return state.set('entitySet', action.data);

    case actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST:
      return state.set('isGettingResults', true)
        .set('topUtilizersResults', Immutable.List())
        .set('neighbors', Immutable.Map());

    case actionTypes.SUBMIT_TOP_UTILIZERS_SUCCESS: {
      const newState = {
        isGettingResults: false,
        topUtilizersResults: action.data
      };
      return state.mergeDeep(newState);
    }

    case actionTypes.SUBMIT_TOP_UTILIZERS_FAILURE:
      return state.set('isGettingResults', false);

    case actionTypes.GET_TOP_UTILIZERS_NEIGHBORS_REQUEST:
      return state.set('isGettingNeighbors', true);

    case actionTypes.GET_TOP_UTILIZERS_NEIGHBORS_SUCCESS:
      // Turns out this action is reduced properly. But because it's so large, it causes
      // Redux DevTools to crash and no longer log future actions.
      return state.set('neighbors', Immutable.fromJS(action.neighbors))
        .set('isGettingNeighbors', false);

    case actionTypes.GET_NEIGHBOR_TYPES_SUCCESS:
      return state.set('neighborTypes', Immutable.fromJS(action.neighborTypes));

    case actionTypes.GET_NEIGHBOR_TYPES_FAILURE:
      return state.set('neighborTypes', Immutable.List());

    case actionTypes.UPDATE_EDGE_TYPES:
      return state.set('topUtilizersDetailsList', action.edgeTypes);

    default:
      return state;
  }
}
