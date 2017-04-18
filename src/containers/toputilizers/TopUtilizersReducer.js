/* @flow */
import Immutable from 'immutable';

import * as actionTypes from './TopUtilizersActionTypes';
import * as ESDActionTypes from '../entitysetdetail/EntitySetDetailActionTypes';
import DummyData from './DummyData';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entitySetId: null,
  associations: DummyData
});

export default function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {
    case ESDActionTypes.ENTITY_SET_REQUEST:
      return state.set('entitySetId', action.id);

    case actionTypes.ON_ASSOCIATION_SELECT:
      const name = action.e.target.name;
      const value = action.e.target.value;
      console.log('on association selectaction:', action);
      // set state w/ name as key

    case actionTypes.ON_TU_ARROW_SELECT:
      console.log('arrow select action:', action);

    case actionTypes.ON_TU_ENTITY_SELECT:
    console.log('entity select action:', action);

    case actionTypes.ON_TU_SUBMIT:
    console.log('submit action:', action);

    default:
      return state;
  }
}
