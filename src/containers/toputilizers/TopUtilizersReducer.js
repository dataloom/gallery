/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './TopUtilizersActionTypes';
import * as ESDActionTypes from '../entitysetdetail/EntitySetDetailActionTypes';
import * as catalogActionTypes from '../catalog/CatalogActionTypes';
import DummyData from './DummyData';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entitySetId: null,
  associations: [],
  topUtilizersDetailsList: {},
  topUtilizersResults: [],
  isGettingResults: false
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case ESDActionTypes.ENTITY_SET_REQUEST:
      return state.set('entitySetId', action.id);

    case actionTypes.SET_ENTITY_SETS:
      console.log('set entity sets:', action);
      return state.set('associations', action.data);

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

    default:
      return state;
  }
}
