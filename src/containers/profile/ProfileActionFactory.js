import * as actionTypes from './ProfileActionTypes';

export function onProfileSubmit() {
  return {
    type: actionTypes.ON_PROFILE_SUBMIT
  };
}

export function handleChange(label, value) {
  return {
    type: actionTypes.HANDLE_CHANGE,
    label,
    value
  };
}
