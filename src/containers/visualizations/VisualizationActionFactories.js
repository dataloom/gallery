import * as VisualizationActionTypes from './VisualizationActionTypes';

export function loadEntitySet(id :string) {
  return {
    type: VisualizationActionTypes.LOAD_ENTITY_SET_REQUEST,
    id
  };
}

export function loadEntitySetSuccess(entitySet :Object) {
  return {
    type: VisualizationActionTypes.LOAD_ENTITY_SET_SUCCESS,
    entitySet
  };
}

export function loadEntitySetFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.LOAD_ENTITY_SET_FAILURE,
    errorMessage
  };
}

export function loadEntityType(entityTypeId :string, entitySetId :string) {
  return {
    type: VisualizationActionTypes.LOAD_ENTITY_TYPE_REQUEST,
    entityTypeId,
    entitySetId
  };
}

export function loadEntityTypeSuccess(entityType :Object) {
  return {
    type: VisualizationActionTypes.LOAD_ENTITY_TYPE_SUCCESS,
    entityType
  };
}

export function loadEntityTypeFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.LOAD_ENTITY_TYPE_FAILURE,
    errorMessage
  };
}

export function loadPropertyTypes(propertyTypeIds :string[], entitySetId :string) {
  return {
    type: VisualizationActionTypes.LOAD_PROPERTY_TYPES_REQUEST,
    propertyTypeIds,
    entitySetId
  };
}

export function loadPropertyTypesSuccess(
    numberProps :Object[],
    dateProps :Object[],
    geoProps :Object[],
    chartOptions :string[]) {
  return {
    type: VisualizationActionTypes.LOAD_PROPERTY_TYPES_SUCCESS,
    numberProps,
    dateProps,
    geoProps,
    chartOptions
  };
}

export function loadPropertyTypesFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.LOAD_PROPERTY_TYPES_FAILURE,
    errorMessage
  };
}

export function checkAuthorizations(accessChecks :Object[], entitySetId :string) {
  return {
    type: VisualizationActionTypes.CHECK_AUTHORIZATIONS_REQUEST,
    accessChecks,
    entitySetId
  };
}

export function checkAuthorizationsSuccess(authorizations :Object) {
  return {
    type: VisualizationActionTypes.CHECK_AUTHORIZATIONS_SUCCESS,
    authorizations
  };
}

export function checkAuthorizationsFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.CHECK_AUTHORIZATIONS_FAILURE,
    errorMessage
  };
}

export function getData(entitySetId :string, propertyTypeIds :string[]) {
  return {
    type: VisualizationActionTypes.GET_DATA_REQUEST,
    entitySetId,
    propertyTypeIds
  };
}

export function getDataSuccess(results :Object[]) {
  return {
    type: VisualizationActionTypes.GET_DATA_SUCCESS,
    results
  };
}

export function getDataFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.GET_DATA_FAILURE,
    errorMessage
  };
}

export function getAllEntitySets() {
  return {
    type: VisualizationActionTypes.GET_ALL_ENTITY_SETS_REQUEST
  };
}

export function getAllEntitySetsSuccess() {
  return {
    type: VisualizationActionTypes.GET_ALL_ENTITY_SETS_SUCCESS
  };
}

export function getAllEntitySetsFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.GET_ALL_ENTITY_SETS_FAILURE,
    errorMessage
  };
}

export function getAllEntityTypesForSets(entitySets :Object[]) {
  return {
    type: VisualizationActionTypes.GET_ALL_ENTITY_TYPES_FOR_SETS_REQUEST,
    entitySets
  };
}

export function getAllEntityTypesForSetsSuccess() {
  return {
    type: VisualizationActionTypes.GET_ALL_ENTITY_TYPES_FOR_SETS_SUCCESS
  };
}

export function getAllEntityTypesForSetsFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.GET_ALL_ENTITY_TYPES_FOR_SETS_FAILURE,
    errorMessage
  };
}

export function getAllPropertyTypesForSets(entitySets :Object[], entityTypes :Object[]) {
  return {
    type: VisualizationActionTypes.GET_ALL_PROPERTY_TYPES_FOR_SETS_REQUEST,
    entitySets,
    entityTypes
  };
}

export function getAllPropertyTypesForSetsSuccess() {
  return {
    type: VisualizationActionTypes.GET_ALL_PROPERTY_TYPES_FOR_SETS_SUCCESS
  };
}

export function getAllPropertyTypesForSetsFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.GET_ALL_PROPERTY_TYPES_FOR_SETS_FAILURE,
    errorMessage
  };
}

export function getVisualizableEntitySets(entitySets :Object[], entityTypes :Object[], propertyTypes :Object[]) {
  return {
    type: VisualizationActionTypes.GET_VISUALIZABLE_ENTITY_SETS_REQUEST,
    entitySets,
    entityTypes,
    propertyTypes
  };
}

export function getVisualizableEntitySetsSuccess(visualizableEntitySets :Object[]) {
  return {
    type: VisualizationActionTypes.GET_VISUALIZABLE_ENTITY_SETS_SUCCESS,
    visualizableEntitySets
  };
}

export function getVisualizableEntitySetsFailure(errorMessage :string) {
  return {
    type: VisualizationActionTypes.GET_VISUALIZABLE_ENTITY_SETS_FAILURE,
    errorMessage
  };
}
