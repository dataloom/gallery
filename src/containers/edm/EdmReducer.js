import Immutable from 'immutable';

import * as EdmActionTypes from './EdmActionTypes';

import { loadEntitySet } from './EdmActionFactories'

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';

export const INITIAL_STATE = Immutable.fromJS({

  // legacy
  asyncState: Immutable.fromJS({
    status: ASYNC_STATUS.PENDING,
    errorMessage: ''
  }),
  entitySetIds: Immutable.List(),

  // new stuff
  entitySets: Immutable.Map(),
  entityTypes: Immutable.Map(),
  propertyTypes: Immutable.Map(),
  entitySetPropertyMetadata: Immutable.Map()
});

export default function reducer(state = INITIAL_STATE, action) {

  switch (action.type) {

    case EdmActionTypes.FETCH_ALL_ENTITY_SETS_REQUEST:
      return state
        .set('asyncState', Immutable.fromJS({
          status: ASYNC_STATUS.LOADING,
          errorMessage: ''
        }))
        .set('entitySets', Immutable.Map());

    case EdmActionTypes.FETCH_ALL_ENTITY_SETS_SUCCESS: {

      const entitySets = Immutable.Map().withMutations((map) => {
        action.entitySets.forEach((entitySet) => {
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

      const entityTypes = Immutable.Map().withMutations((map) => {
        action.entityTypes.forEach((entityType) => {
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

      const propertyTypes = Immutable.Map().withMutations((map) => {
        action.propertyTypes.forEach((propertyType) => {
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

      const updatedEntitySets = state.get('entitySets').withMutations((entitySets) => {
        Object.keys(action.edm.entitySets).forEach((entitySetId) => {
          const entitySet = action.edm.entitySets[entitySetId];
          if (entitySet) {
            entitySets.set(entitySet.id, Immutable.fromJS(entitySet));
          }
        });
      });

      const updatedEntityTypes = state.get('entityTypes').withMutations((entityTypes) => {
        Object.keys(action.edm.entityTypes).forEach((entityTypeId) => {
          const entityType = action.edm.entityTypes[entityTypeId];
          if (entityType) {
            entityTypes.set(entityType.id, Immutable.fromJS(entityType));
          }
        });
      });

      const updatedPropertyTypes = state.get('propertyTypes').withMutations((entityTypes) => {
        Object.keys(action.edm.propertyTypes).forEach((propertyTypeId) => {
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

      const updatedEntitySets = state.get('entitySets').withMutations((entitySets) => {
        Object.keys(action.entitySets).forEach((entitySetId) => {
          const entitySet = action.entitySets[entitySetId];
          if (entitySet) {
            entitySets.set(entitySet.id, Immutable.fromJS(entitySet));
          }
        });
      });

      return state.set('entitySets', updatedEntitySets);
    }

    case EdmActionTypes.GET_ALL_ENTITY_SET_PROPERTY_METADATA_SUCCESS: {
      return state
        .setIn(['entitySetPropertyMetadata', action.entitySetId], Immutable.fromJS(action.entitySetPropertyMetadata));
    }

    case loadEntitySet.case(action.type): {
      return loadEntitySet.reducer(state, action, {
        SUCCESS: () => state.setIn(['entitySets', action.value.id], Immutable.fromJS(action.value))
      });
    }

    default:
      return state;
  }
}
