/* @flow */
import { Observable } from 'rxjs';
import { combineEpics } from 'redux-observable';
import Promise from 'bluebird';
import Immutable from 'immutable';
import { AuthorizationApi, EntityDataModelApi, DataApi } from 'lattice';

import EdmConsts from '../../utils/Consts/EdmConsts';
import VisualizationConsts from '../../utils/Consts/VisualizationConsts';
import * as actionTypes from './VisualizationActionTypes';
import * as actionFactories from './VisualizationActionFactories';
import { Permission } from '../../core/permissions/Permission';

const MAX_POINTS_TO_DISPLAY = 1000;

function loadEntitySetEpic(action$) {
  return action$
    .ofType(actionTypes.LOAD_ENTITY_SET_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(EntityDataModelApi.getEntitySet(action.id))
        .mergeMap((entitySet) => {
          return Observable.of(
            actionFactories.loadEntitySetSuccess(entitySet),
            actionFactories.loadEntityType(entitySet.entityTypeId, entitySet.id)
          );
        })
        // Error Handling
        .catch((error) => {
          return Observable.of(actionFactories.loadEntitySetFailure('Error loading entity set'));
        });
    });
}

function loadEntityTypeEpic(action$) {
  return action$
    .ofType(actionTypes.LOAD_ENTITY_TYPE_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(EntityDataModelApi.getEntityType(action.entityTypeId))
        .mergeMap((entityType) => {
          const accessChecks = entityType.properties.map((propertyTypeId) => {
            return {
              aclKey: [action.entitySetId, propertyTypeId],
              permissions: [Permission.READ.name]
            };
          });

          return Observable.of(
            actionFactories.loadEntityTypeSuccess(entityType),
            actionFactories.checkAuthorizations(accessChecks, action.entitySetId)
          );
        })
        // Error Handling
        .catch((error) => {
          console.error(error);
          return Observable.of(actionFactories.loadEntityTypeFailure('Error loading entity type'))
        });
    });
}

function loadPropertyTypesEpic(action$) {
  return action$
    .ofType(actionTypes.LOAD_PROPERTY_TYPES_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(Promise.map(action.propertyTypeIds, (propertyId) => {
          return EntityDataModelApi.getPropertyType(propertyId);
        }))
        .mergeMap((propertyTypes) => {
          let latProp = null;
          let longProp = null;
          const numberProps = [];
          const dateProps = [];
          const geoProps = [];
          propertyTypes.forEach((prop) => {
            if (EdmConsts.EDM_NUMBER_TYPES.includes(prop.datatype)) {
              numberProps.push(prop);
              const propName = prop.type.name.trim().toLowerCase();
              if (propName === VisualizationConsts.LATITUDE) {
                latProp = prop;
              }
              else if (propName === VisualizationConsts.LONGITUDE) {
                longProp = prop;
              }
            }
            else if (EdmConsts.EDM_DATE_TYPES.includes(prop.datatype)) {
              dateProps.push(prop);
            }
            else if (EdmConsts.EDM_GEOGRAPHY_TYPES.includes(prop.datatype)) {
              geoProps.push(prop);
            }
          });
          if (!!latProp && !!longProp) geoProps.push({ latProp, longProp });
          const chartOptions = [];
          if (numberProps.length + dateProps.length > 1) {
            chartOptions.push(VisualizationConsts.SCATTER_CHART);
            chartOptions.push(VisualizationConsts.LINE_CHART);
          }
          if (geoProps.length > 0) chartOptions.push(VisualizationConsts.MAP_CHART);
          if (chartOptions.length === 0) {
            return Observable.of(
              actionFactories.loadPropertyTypesSuccess(numberProps, dateProps, geoProps, chartOptions)
            );
          }
          const propsToLoad = numberProps.concat(dateProps);
          geoProps.forEach((prop) => {
            if (!prop.latProp) propsToLoad.push(prop);
          });
          return Observable.of(
            actionFactories.loadPropertyTypesSuccess(numberProps, dateProps, geoProps, chartOptions),
            actionFactories.getData(action.entitySetId, propsToLoad.map(prop => prop.id))
          );
        })
        // Error Handling
        .catch(error => {
          console.error(error);
          return Observable.of(actionFactories.loadPropertyTypesFailure('Error loading property types'))
        });
    });
}

function checkAuthorizationsEpic(action$) {
  return action$
    .ofType(actionTypes.CHECK_AUTHORIZATIONS_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(AuthorizationApi.checkAuthorizations(action.accessChecks))
        .mergeMap((response) => {
          const authorizedPropertyTypes = [];
          response.forEach((authorization) => {
            if (authorization.permissions.READ) authorizedPropertyTypes.push(authorization.aclKey[1]);
          });
          return Observable.of(
            actionFactories.checkAuthorizationsSuccess(response),
            actionFactories.loadPropertyTypes(authorizedPropertyTypes, action.entitySetId)
          );
        })
        // Error Handling
        .catch((error) => {
          console.error(error);
          return Observable.of(actionFactories.checkAuthorizationsFailure('Error loading owned property type authorizations'));
        });
    });
}

function getDataEpic(action$) {
  return action$
    .ofType(actionTypes.GET_DATA_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(DataApi.getEntitySetData(action.entitySetId, '', action.propertyTypeIds))
        .mergeMap((data) => {
          let filteredData = data;
          if (data.length > MAX_POINTS_TO_DISPLAY) {
            const frequencyToAccept = Math.floor(data.length / MAX_POINTS_TO_DISPLAY);
            filteredData = data.filter((point, index) => {
              return (index % frequencyToAccept === 0);
            });
          }
          return Observable.of(
            actionFactories.getDataSuccess(filteredData)
          );
        })
        // Error Handling
        .catch((error) => {
          console.error(error);
          return Observable.of(actionFactories.getDataFailure('Error loading entity set data'))
        });
    });
}

function getAllEntitySetsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ALL_ENTITY_SETS_REQUEST)
    .mergeMap((action :Action) => {
      return Observable
        .from(EntityDataModelApi.getAllEntitySets())
        .mergeMap((entitySetsRaw) => {
          const entitySets = entitySetsRaw.filter(entitySet => entitySet);
          return Observable.of(
            actionFactories.getAllEntitySetsSuccess(entitySets),
            actionFactories.getAllEntityTypesForSets(entitySets)
          );
        })
        // Error Handling
        .catch((error) => {
          console.error(error);
          return Observable.of(actionFactories.getAllEntitySetsFailure('Error loading all entity sets'));
        });
    });
}

function getAllEntityTypesForSetsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ALL_ENTITY_TYPES_FOR_SETS_REQUEST)
    .mergeMap((action :Action) => {
      const entityTypeIds = action.entitySets.map((entitySet) => {
        return entitySet.entityTypeId
      });
      return Observable
        .from(Promise.map(entityTypeIds, (entityTypeId) => {
          return EntityDataModelApi.getEntityType(entityTypeId);
        }))
        .mergeMap((entityTypes) => {
          return Observable.of(
            actionFactories.getAllEntityTypesForSetsSuccess(),
            actionFactories.getAllPropertyTypesForSets(action.entitySets, entityTypes)
          );
        })
        // Error Handling
        .catch((error) => {
          console.error(error);
          return Observable.of(actionFactories.getAllEntityTypesForSetsFailure('Error loading entity types for entity sets'));
        });
    });
}

function getAllPropertyTypesForSetsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_ALL_PROPERTY_TYPES_FOR_SETS_REQUEST)
    .mergeMap((action :Action) => {
      const propertyTypeIds = new Set();
      action.entityTypes.forEach((entityType) => {
        entityType.properties.forEach((propertyId) => {
          propertyTypeIds.add(propertyId);
        });
      });
      return Observable
        .from(Promise.map(Array.from(propertyTypeIds), (propertyTypeId) => {
          return EntityDataModelApi.getPropertyType(propertyTypeId);
        }))
        .mergeMap((propertyTypes) => {
          return Observable.of(
            actionFactories.getAllPropertyTypesForSetsSuccess(),
            actionFactories.getVisualizableEntitySets(action.entitySets, action.entityTypes, propertyTypes)
          );
        })
        // Error Handling
        .catch((error) => {
          console.error(error);
          return Observable.of(actionFactories.getAllPropertyTypesForSetsFailure('Error loading property types for entity sets'));
        });
    });
}

function getVisualizableEntitySetsEpic(action$) {
  return action$
    .ofType(actionTypes.GET_VISUALIZABLE_ENTITY_SETS_REQUEST)
    .mergeMap((action :Action) => {
      const pidToDatatype = {};
      action.propertyTypes.forEach((propertyType) => {
        pidToDatatype[propertyType.id] = propertyType.datatype;
      });
      const eidToVisualizableProps = {};
      action.entityTypes.forEach((entityType) => {
        const visualizableProps = [];
        entityType.properties.forEach((pid) => {
          if (EdmConsts.EDM_NUMBER_TYPES
            .concat(EdmConsts.EDM_DATE_TYPES)
            .concat(EdmConsts.EDM_GEOGRAPHY_TYPES)
            .includes(pidToDatatype[pid])) {
            visualizableProps.push(pid);
          }
        });
        eidToVisualizableProps[entityType.id] = visualizableProps;
      });
      const accessChecks = [];
      action.entitySets.forEach((entitySet) => {
        const visualizableProps = eidToVisualizableProps[entitySet.entityTypeId];
        if (visualizableProps.length > 1) {
          visualizableProps.forEach((pid) => {
            accessChecks.push({
              aclKey: [entitySet.id, pid],
              permissions: [Permission.READ.name]
            });
          });
        }
      });
      return Observable
        .from(AuthorizationApi.checkAuthorizations(accessChecks))
        .mergeMap((authorizations) => {
          const entitySetsToNumProps = {};
          authorizations.forEach((check) => {
            if (check.permissions.READ) {
              if (entitySetsToNumProps[check.aclKey[0]]) {
                entitySetsToNumProps[check.aclKey[0]] += 1;
              }
              else entitySetsToNumProps[check.aclKey[0]] = 1;
            }
          });
          const visualizableEntitySets = action.entitySets.filter((entitySet) => {
            return (entitySetsToNumProps[entitySet.id] && entitySetsToNumProps[entitySet.id] > 1);
          });
          return Observable.of(
            actionFactories.getVisualizableEntitySetsSuccess(visualizableEntitySets)
          );
        })
        // Error Handling
        .catch((error) => {
          console.error(error);
          return Observable.of(actionFactories.getVisualizableEntitySetsFailure('Error loading visualizable entity sets'));
        });
    });
}

export default combineEpics(
  loadEntitySetEpic,
  loadEntityTypeEpic,
  loadPropertyTypesEpic,
  checkAuthorizationsEpic,
  getDataEpic,
  getAllEntitySetsEpic,
  getAllEntityTypesForSetsEpic,
  getAllPropertyTypesForSetsEpic,
  getVisualizableEntitySetsEpic
);
