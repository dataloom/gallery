/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './TopUtilizersActionTypes';
import * as ESDActionTypes from '../entitysetdetail/EntitySetDetailActionTypes';
import DummyData from './DummyData';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entitySetId: null,
  associations: DummyData,
  searchQuery: {},
  topUtilizers: []
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case ESDActionTypes.ENTITY_SET_REQUEST:
      return state.set('entitySetId', action.id);

    case actionTypes.ON_ASSOCIATION_SELECT:
      console.log('on association selection:', action);
      return state;

    case actionTypes.ON_ARROW_SELECT:
      console.log('arrow select action:', action);
      return state;

    case actionTypes.ON_ENTITY_SELECT:
    console.log('entity select action:', action);
    const { selectedAssociation, selectedArrow, selectedEntities } = action.data;
    // const mergeObj = {
    //   searchQuery: {
    //     [assocValue]: {
    //       label,
    //       vertexIsSrc: null,
    //       selectedEntities: []
    //     }
    //   }
    // };
    // return state.mergeDeep(mergeObj);
    return state;

    case actionTypes.SUBMIT_TOP_UTILIZERS_REQUEST:
      console.log('submit action:', action);
      return state;

    case actionTypes.SUBMIT_TOP_UTILIZERS_SUCCESS:
      console.log('submit SUCCESS:', action);
      return state.set('topUtilizers', action.data);

    default:
      return state;
  }
}
