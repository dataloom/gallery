import * as actionTypes from './TopUtilizersActionTypes';

export function onAssociationSelect(data) {
  return {
    type: actionTypes.ON_ASSOCIATION_SELECT,
    data
  };
}

export function onArrowSelect(e) {
  return {
    type: actionTypes.ON_ARROW_SELECT,
    e
  };
}

export function onEntitySelect(e) {
  return {
    type: actionTypes.ON_ENTITY_SELECT,
    e
  };
}

export function onSubmit(e) {
  return {
    type: actionTypes.ON_SUBMIT,
    e
  };
}
