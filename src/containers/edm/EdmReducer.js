/*
 * @flow
 */

import Immutable from 'immutable';

import * as EdmActionTypes from './EdmActionTypes';

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

export const INITIAL_STATE :Map<> = Immutable.fromJS({

  // legacy
  asyncState: Immutable.fromJS({
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  }),
  entitySetIds: Immutable.List(),

  // new stuff
  entitySets: Immutable.Map(),
  entityTypes: Immutable.Map(),
  propertyTypes: Immutable.Map()
});

export default function reducer(state :Map<> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case EdmActionTypes.FETCH_ALL_ENTITY_SETS_REQUEST:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }))
        .set('entitySets', Immutable.Map());

    case EdmActionTypes.FETCH_ALL_ENTITY_SETS_SUCCESS: {

      const entitySets :Map = Immutable.Map().withMutations((map :Map) => {
        action.entitySets.forEach((entitySet :Object) => {
          if (entitySet) {
            map.set(entitySet.id, Immutable.fromJS(entitySet));
          }
        });
      });

      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }))
        .set('entitySets', entitySets);
    }

    case EdmActionTypes.FETCH_ALL_ENTITY_SETS_FAILURE:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }))
        .set('entitySets', Immutable.Map());

    case EdmActionTypes.FETCH_ALL_ENTITY_TYPES_REQUEST:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }))
        .set('entityTypes', Immutable.Map());

    case EdmActionTypes.FETCH_ALL_ENTITY_TYPES_SUCCESS: {

      const entityTypes :Map = Immutable.Map().withMutations((map :Map) => {
        action.entityTypes.forEach((entityType :Object) => {
          if (entityType) {
            map.set(entityType.id, Immutable.fromJS(entityType));
          }
        });
      });


      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }))
        .set('entityTypes', entityTypes);
    }

    case EdmActionTypes.FETCH_ALL_ENTITY_TYPES_FAILURE:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }))
        .set('entityTypes', Immutable.Map());

    case EdmActionTypes.FETCH_ALL_PROPERTY_TYPES_REQUEST:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }))
        .set('propertyTypes', Immutable.Map());

    case EdmActionTypes.FETCH_ALL_PROPERTY_TYPES_SUCCESS: {

      const propertyTypes :Map = Immutable.Map().withMutations((map :Map) => {
        action.propertyTypes.forEach((propertyType :Object) => {
          if (propertyType) {
            map.set(propertyType.id, Immutable.fromJS(propertyType));
          }
        });
      });

      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.SUCCESS,
          errorMessage: ''
        }))
        .set('propertyTypes', propertyTypes);
    }

    case EdmActionTypes.FETCH_ALL_PROPERTY_TYPES_FAILURE:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.ERROR,
          errorMessage: action.errorMessage
        }))
        .set('propertyTypes', Immutable.Map());

    case EdmActionTypes.FETCH_ENTITY_SET_PROJECTION_REQUEST:
      return state;

    case EdmActionTypes.FETCH_ENTITY_SET_PROJECTION_FAILURE:
      return state;

    case EdmActionTypes.FETCH_ENTITY_SET_PROJECTION_SUCCESS: {

      const updatedEntitySets :Map = state.get('entitySets').withMutations((entitySets :Map) => {
        Object.keys(action.edm.entitySets).forEach((entitySetId :string) => {
          const entitySet = action.edm.entitySets[entitySetId];
          if (entitySet) {
            entitySets.set(entitySet.id, Immutable.fromJS(entitySet));
          }
        });
      });

      const updatedEntityTypes :Map = state.get('entityTypes').withMutations((entityTypes :Map) => {
        Object.keys(action.edm.entityTypes).forEach((entityTypeId :string) => {
          const entityType = action.edm.entityTypes[entityTypeId];
          if (entityType) {
            entityTypes.set(entityType.id, Immutable.fromJS(entityType));
          }
        });
      });

      const updatedPropertyTypes :Map = state.get('propertyTypes').withMutations((entityTypes :Map) => {
        Object.keys(action.edm.propertyTypes).forEach((propertyTypeId :string) => {
          const propertyType = action.edm.propertyTypes[propertyTypeId];
          if (propertyType) {
            entityTypes.set(propertyType.id, Immutable.fromJS(propertyType));
          }
        });
      });

      return state
        .set('entitySets', updatedEntitySets)
        .set('entityTypes', updatedEntityTypes)
        .set('propertyTypes', updatedPropertyTypes);
    }

    case EdmActionTypes.UPDATE_ENTITY_SETS: {

      const updatedEntitySets :Map = state.get('entitySets').withMutations((entitySets :Map) => {
        Object.keys(action.entitySets).forEach((entitySetId :string) => {
          const entitySet = action.entitySets[entitySetId];
          if (entitySet) {
            entitySets.set(entitySet.id, Immutable.fromJS(entitySet));
          }
        });
      });

      return state.set('entitySets', updatedEntitySets);
    }

    default:
      return state;
  }
}
