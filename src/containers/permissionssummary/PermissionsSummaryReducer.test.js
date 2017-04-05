import { expect } from 'chai';
import '../../../config/chai/chai.config';

import Immutable from 'immutable';
import * as PSActionFactory from './PermissionsSummaryActionFactory';
import reducer from './PermissionsSummaryReducer';

describe('PermissionsSummaryReducer', function() {
  let INITIAL_STATE;

  beforeEach(function() {
    INITIAL_STATE = reducer(undefined, { type: 'init' }); // QUESTION: Does this jive w/ actual inItial state?
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

  it('should update allUsersById', function() {
    const users = Immutable.fromJS([{test: 'user1'}, {test: 'user2'}]);
    const roles = Immutable.fromJS([{test: 'role1'}, {test: 'role2'}]);
    const action = PSActionFactory.getAllUsersAndRolesSuccess(users, roles);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('allUsersById').equal(users);
  });

  it('should update allRolesList', function() {
    const users = Immutable.fromJS([{test: 'user1'}, {test: 'user2'}]);
    const roles = Immutable.fromJS([{test: 'role1'}, {test: 'role2'}]);
    const action = PSActionFactory.getAllUsersAndRolesSuccess(users, roles);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('allRolesList').equal(roles);
  });

  it('should update isGettingUsersRoles to false (failure case)', function() {
    const action = PSActionFactory.getAllUsersAndRolesFailure();
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingUsersRoles').equal(false);
  });

  it('should update isGettingAcls to true', function() {
    const entitySet = {};
    const action = PSActionFactory.getAcls(entitySet);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingAcls').equal(true);
  });

  it('should update isGettingAcls to false', function() {
    const entitySetId = '';
    const property = {};
    const action = PSActionFactory.getUserRolePermissionsRequest(entitySetId, property);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingAcls').equal(false);
  });

  it('should update isGettingPermissions to true', function() {
    const entitySetId = '';
    const property = {};
    const action = PSActionFactory.getUserRolePermissionsRequest(entitySetId, property);
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingPermissions').equal(true);
  });

  it('should update isGettingPermissions to false (success case)', function() {
    const action = PSActionFactory.getUserRolePermissionsSuccess();
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingPermissions').equal(false);
  });

  it('should update isGettingPermissions to false (failure case)', function() {
    const action = PSActionFactory.getUserRolePermissionsFailure();
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.have.property('isGettingPermissions').equal(false);
  });

  // it('should get role permissions', function() {
  //   const property = {title: 'title'};
  //   const data = {};
  //   const action = PSActionFactory.setRolePermissions(property, data);
  //   const permissions = getRolePermissions(action); // TODO: import function
  //   const result = {};
  //
  //   expect(permissions).to.equal(result);
  // })

  // it('should update property role permissions', function() {
  //   const property = {title: 'title'};
  //   const data = {};
  //   const action = PSActionFactory.setRolePermissions(property, data);
  //   const permissions = getRolePermissions(action); // TODO: import function
  //   const state = reducer(INITIAL_STATE, action);
  //
    // expect(state).to.have.deep.property(`propertyPermissions.${property.title}`).equal(permissions);
  // });

  // it('should update entity role permissions', function() {
  //   const property = undefined;
  //   const data = {};
  //   const action = PSActionFactory.setRolePermissions(property, data);
  //   const permissions = getRolePermissions(action); // TODO: import function
  //   const state = reducer(INITIAL_STATE, action);
  //
  //   expect(state).to.have.property('entityRolePermissions').equal(permissions);
  // });

  // TODO: COPY ABOVE TESTS FOR SET USER PERMISSIONS

  it('should reset permissions', function() {
    const action = PSActionFactory.resetPermissions();
    const state = reducer(INITIAL_STATE, action);

    expect(state).to.equal(INITIAL_STATE);
  });
});
