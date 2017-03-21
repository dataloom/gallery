/*
 * @flow
 */

import Immutable from 'immutable';

import { ASYNC_STATUS } from '../../../components/asynccontent/AsyncContent';
import * as VisualizationActionTypes from './VisualizationActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  visualizableEntitySets: Immutable.List(),
  entitySet: Immutable.Map(),
  propertyTypes: Immutable.List(),
  numberProps: Immutable.List(),
  geoProps: Immutable.List(),
  dateProps: Immutable.List(),
  results: Immutable.List(),
  chartOptions: Immutable.List(),
  errorMessage: '',
  isLoadingDataStatus: ASYNC_STATUS.PENDING,
  isLoadingVisualizableEntitySetsStatus: ASYNC_STATUS.PENDING
});

export default function principalsReducer(state :Immutable.Map = INITIAL_STATE, action :Object) :Immutable.Map {

  switch (action.type) {

    case VisualizationActionTypes.LOAD_ENTITY_SET_REQUEST:
      return INITIAL_STATE.set('isLoadingDataStatus', ASYNC_STATUS.LOADING);

    case VisualizationActionTypes.LOAD_ENTITY_SET_SUCCESS:
      return state.set('entitySet', action.entitySet);

    case VisualizationActionTypes.LOAD_ENTITY_SET_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('entitySet', Immutable.Map())
        .set('isLoadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.LOAD_ENTITY_TYPE_REQUEST:
      return state;

    case VisualizationActionTypes.LOAD_ENTITY_TYPE_SUCCESS:
      return state.set('propertyTypes', Immutable.Map());

    case VisualizationActionTypes.LOAD_ENTITY_TYPE_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('isLoadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.LOAD_PROPERTY_TYPES_REQUEST:
      return state;

    case VisualizationActionTypes.LOAD_PROPERTY_TYPES_SUCCESS: {
      const isLoadingDataStatus = (action.chartOptions.length > 1) ? ASYNC_STATUS.LOADING : ASYNC_STATUS.SUCCESS;
      return state
        .set('numberProps', action.numberProps)
        .set('dateProps', action.dateProps)
        .set('geoProps', action.geoProps)
        .set('chartOptions', action.chartOptions)
        .set('isLoadingDataStatus', isLoadingDataStatus);
    }

    case VisualizationActionTypes.LOAD_PROPERTY_TYPES_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('isLoadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.CHECK_AUTHORIZATIONS_REQUEST:
      return state;

    case VisualizationActionTypes.CHECK_AUTHORIZATIONS_SUCCESS:
      return state;

    case VisualizationActionTypes.CHECK_AUTHORIZATIONS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('isLoadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_DATA_REQUEST:
      return state;

    case VisualizationActionTypes.GET_DATA_SUCCESS:
      return state
        .set('results', action.results)
        .set('isLoadingDataStatus', ASYNC_STATUS.SUCCESS);

    case VisualizationActionTypes.GET_DATA_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('results', Immutable.List())
        .set('isLoadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_ALL_ENTITY_SETS_REQUEST:
      return INITIAL_STATE.set('isLoadingVisualizableEntitySetsStatus', ASYNC_STATUS.LOADING);

    case VisualizationActionTypes.GET_ALL_ENTITY_SETS_SUCCESS:
      return state;

    case VisualizationActionTypes.GET_ALL_ENTITY_SETS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('isLoadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_ALL_ENTITY_TYPES_FOR_SETS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('isLoadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_ALL_PROPERTY_TYPES_FOR_SETS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('isLoadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_VISUALIZABLE_ENTITY_SETS_SUCCESS:
      return state
        .set('visualizableEntitySets', action.visualizableEntitySets)
        .set('isLoadingVisualizableEntitySetsStatus', ASYNC_STATUS.SUCCESS);

    case VisualizationActionTypes.GET_VISUALIZABLE_ENTITY_SETS_FAILURE:
      return state.set('isLoadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    default:
      return state;
  }
}
