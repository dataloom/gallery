import { expect } from 'chai';
import '../../../config/chai/plugins.config';

import * as PermissionsActionFactory from './PermissionsActionFactory';
import reducer from './PermissionsReducer';


describe('PermissionsReducer', function() {
  let INITIAL_STATE;

  beforeEach(function() {
    INITIAL_STATE = reducer(undefined, { type: 'init' });
  });

  // TODO: Refactor AsyncComponent to allow shallow testing of form events
  it('should update reason', function () {
    const reason = 'reason';
    const action = PermissionsActionFactory.requestPermissionsUpdateReason(reason);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.deep.property('requestPermissionsModal.reason').equal(reason);
  });


  it('should save permissions requests', function () {
    const pid = 'abc';
    const permissionsRequest = ['READ'];

    const action = PermissionsActionFactory.requestPermissionsUpdateRequest(pid, permissionsRequest);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.deep.property(['requestPermissionsModal', 'pidToRequestedPermissions', pid]).equal(permissionsRequest);
  });

  it('should remove empty permissions requests', function () {
    const pid = 'abc';
    const permissionsRequestRead = ['READ'];
    const emptyPermissionsRequest = [];

    let action = PermissionsActionFactory.requestPermissionsUpdateRequest(pid, permissionsRequestRead);
    let state = reducer(INITIAL_STATE, action);

    action = PermissionsActionFactory.requestPermissionsUpdateRequest(pid, emptyPermissionsRequest);
    state = reducer(state, action);

    expect(state).to.not.have.deep.property(['requestPermissionsModal', 'pidToRequestedPermissions', pid]);
  });

});
