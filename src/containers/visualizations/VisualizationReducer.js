/*
 * @flow
 */

import Immutable from 'immutable';

import { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import * as VisualizationActionTypes from './VisualizationActionTypes';

const INITIAL_STATE :Map<*, *> = Immutable.fromJS({
  visualizableEntitySets: Immutable.List(),
  entitySet: Immutable.Map(),
  numberProps: Immutable.List(),
  geoProps: Immutable.List(),
  dateProps: Immutable.List(),
  results: Immutable.List(),
  chartOptions: Immutable.List(),
  errorMessage: '',
  loadingDataStatus: ASYNC_STATUS.PENDING,
  loadingVisualizableEntitySetsStatus: ASYNC_STATUS.PENDING
});

export default function visualizationsReducer(state :Immutable.Map = INITIAL_STATE, action :Object) :Immutable.Map {

  switch (action.type) {

    case VisualizationActionTypes.LOAD_ENTITY_SET_REQUEST:
      return INITIAL_STATE.set('loadingDataStatus', ASYNC_STATUS.LOADING);

    case VisualizationActionTypes.LOAD_ENTITY_SET_SUCCESS:
      return state.set('entitySet', Immutable.fromJS(action.entitySet));

    case VisualizationActionTypes.LOAD_ENTITY_SET_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('entitySet', Immutable.Map())
        .set('loadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.LOAD_ENTITY_TYPE_REQUEST:
      return state;

    case VisualizationActionTypes.LOAD_ENTITY_TYPE_SUCCESS:
      return state;

    case VisualizationActionTypes.LOAD_ENTITY_TYPE_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('loadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.LOAD_PROPERTY_TYPES_REQUEST:
      return state;

    case VisualizationActionTypes.LOAD_PROPERTY_TYPES_SUCCESS: {
      const loadingDataStatus = (action.chartOptions.length > 1) ? ASYNC_STATUS.LOADING : ASYNC_STATUS.SUCCESS;
      return state
        .set('numberProps', Immutable.fromJS(action.numberProps))
        .set('dateProps', Immutable.fromJS(action.dateProps))
        .set('geoProps', Immutable.fromJS(action.geoProps))
        .set('chartOptions', Immutable.fromJS(action.chartOptions))
        .set('loadingDataStatus', loadingDataStatus);
    }

    case VisualizationActionTypes.LOAD_PROPERTY_TYPES_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('loadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.CHECK_AUTHORIZATIONS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('loadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_DATA_SUCCESS:
      return state
        .set('results', Immutable.fromJS(action.results))
        .set('loadingDataStatus', ASYNC_STATUS.SUCCESS);

    case VisualizationActionTypes.GET_DATA_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('results', Immutable.List())
        .set('loadingDataStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_ALL_ENTITY_SETS_REQUEST:
      return INITIAL_STATE.set('loadingVisualizableEntitySetsStatus', ASYNC_STATUS.LOADING);

    case VisualizationActionTypes.GET_ALL_ENTITY_SETS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('loadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_ALL_ENTITY_TYPES_FOR_SETS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('loadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_ALL_PROPERTY_TYPES_FOR_SETS_FAILURE:
      return state
        .set('errorMessage', action.errorMessage)
        .set('loadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    case VisualizationActionTypes.GET_VISUALIZABLE_ENTITY_SETS_SUCCESS:
      return state
        .set('visualizableEntitySets', Immutable.fromJS(action.visualizableEntitySets))
        .set('loadingVisualizableEntitySetsStatus', ASYNC_STATUS.SUCCESS);

    case VisualizationActionTypes.GET_VISUALIZABLE_ENTITY_SETS_FAILURE:
      return state.set('loadingVisualizableEntitySetsStatus', ASYNC_STATUS.ERROR);

    default:
      return state;
  }
}
