/* @flow */
import Immutable from 'immutable';

import * as edmActionTypes from '../edm/EdmActionTypes';

export const INITIAL_STATE:Immutable.Map<*, *> = Immutable.fromJS({
  entityTypeReferences: [],
  // TODO: Add Async state for PropertyTypeReferences
  propertyTypeReferences: []
});

export default function reducer(state:Immutable.Map = INITIAL_STATE, action:Object) {
  // switch (action.type) {
  //   case edmActionTypes.ALL_ENTITY_TYPES_REQUEST:
  //     return state.merge({
  //       entityTypeReferences: []
  //     });
  //   case edmActionTypes.ALL_ENTITY_TYPES_REJECT:
  //     // TODO: Handle error case
  //     return state;
  //   case edmActionTypes.ALL_ENTITY_TYPES_RESOLVE:
  //     return state.merge({
  //       entityTypeReferences: action.references
  //     });
  //
  //   case edmActionTypes.ALL_PROPERTY_TYPES_REQUEST:
  //     return state.merge({
  //       propertyTypeReferences: []
  //     });
  //   case edmActionTypes.ALL_PROPERTY_TYPES_REJECT:
  //     // TODO: Handle error case
  //     return state;
  //   case edmActionTypes.ALL_PROPERTY_TYPES_RESOLVE:
  //     return state.merge({
  //       propertyTypeReferences: action.references
  //     });
  //
  //   default:
  //     return state;
  // }

  return state;
}
