import { expect } from 'chai';
import '../../../config/chai/chai.config';

import * as PSActionFactory from './PermissionsSummaryActionFactory';
import reducer from './PermissionsSummaryReducer';

describe('PermissionsSummaryReducer', function() {
  let INITIAL_STATE;

  beforeEach(function() {
    INITIAL_STATE = reducer(undefined, { type: 'init' });
  });

  it('should update isGettingUsersRoles to true', function() {
    const entitySet = {};
    const action = PSActionFactory.getAllUsersAndRolesRequest(entitySet);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingUsersRoles').equal(true);
  });

  it('should update isGettingUsersRoles to false (success case)', function() {
    const users = {};
    const roles = [];
    const action = PSActionFactory.getAllUsersAndRolesSuccess(users, roles);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingUsersRoles').equal(false);
  });

  it('should update isGettingUsersRoles to false (failure case)', function() {
    const action = PSActionFactory.getAllUsersAndRolesFailure();
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingUsersRoles').equal(false);
  });
});
