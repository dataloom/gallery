import * as actionTypes from './TopUtilizersActionTypes';

export function onAssociationSelect(e) {
  return {
    type: actionTypes.ON_TU_ASSOCIATION_SELECT,
    e
  };
}

export function onArrowSelect(e) {
  return {
    type: actionTypes.ON_TU_ARROW_SELECT,
    e
  };
}

export function onEntitySelect(e) {
  return {
    type: actionTypes.ON_TU_ENTITY_SELECT,
    e
  };
}

export function onSubmit(e) {
  return {
    type: actionTypes.ON_TU_SUBMIT,
    e
  };
}
