import { expect } from 'chai';
import Immutable from 'immutable';

import '../../../config/chai/chai.config';
import * as PSActionFactory from './PermissionsSummaryActionFactory';
import reducer from './PermissionsSummaryReducer';
import { getRolePermissions, getUserPermissions } from './PermissionsSummaryHelpers';

const allUsersById = {
  'auth0|foo': {
    email: 'foo',
    nickname: 'bar',
    organization: [],
    roles: ['foo', 'AuthenticatedUser'],
    user_id: 'auth0|foo',
    username: 'baz'
  }
};

const property = {
  title: 'title'
};

const data = {
  authenticatedUserPermissions: [],
  roleAcls: {
    Discover: [],
    Link: ['foo'],
    Read: [],
    Write: []
  },
  userAcls: {
    Discover: [],
    Link: [],
    Read: [],
    Write: ['auth0|foo'],
    Ownder: []
  }
};

describe('PermissionsSummaryReducer', function() {
  let INITIAL_STATE;

  beforeEach(function() {
    INITIAL_STATE = reducer(undefined, { type: 'init' });
  });

  describe('Load users and roles', function() {
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
  });

  describe('Load permissions', function() {
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

    it('should update property role permissions', function() {
      const action = PSActionFactory.setRolePermissions(property, data);
      const permissions = Immutable.fromJS(getRolePermissions(action));
      const state = reducer(INITIAL_STATE, action);

      expect(state).to.have.deep.property(`propertyPermissions.${property.title}.rolePermissions`).eql(permissions);
    });

    it('should update entity role permissions', function() {
      const action = PSActionFactory.setRolePermissions(undefined, data);
      const permissions = Immutable.fromJS(getRolePermissions(action));
      const state = reducer(INITIAL_STATE, action);

      expect(state).to.have.property('entityRolePermissions').eql(permissions);
    });

    it('should update property user permissions', function() {

      const action = PSActionFactory.setUserPermissions(property, data);
      const allUsersByIdMap = Immutable.fromJS(allUsersById);
      const initialState = INITIAL_STATE.set('allUsersById', allUsersByIdMap);
      const state = reducer(initialState, action);

      const expectedPermissions = Immutable.fromJS(
        getUserPermissions(action, allUsersByIdMap)
      );

      expect(state).to.have.deep.property(
        `propertyPermissions.${property.title}.userPermissions`
      ).eql(expectedPermissions);
    });

    it('should update entity user permissions', function() {

      const action = PSActionFactory.setUserPermissions(undefined, data);
      const allUsersByIdMap = Immutable.fromJS(allUsersById);
      const initialState = INITIAL_STATE.set('allUsersById', allUsersByIdMap);
      const state = reducer(initialState, action);

      const expectedPermissions = Immutable.fromJS(
        getUserPermissions(action, allUsersByIdMap)
      );

      expect(state).to.have.property(
        'entityUserPermissions'
      ).eql(expectedPermissions);
    });
  });

  describe('Reset permissions', function() {
    it('should reset permissions', function() {
      const action = PSActionFactory.resetPermissions();
      const state = reducer(INITIAL_STATE, action);

      expect(state).to.equal(INITIAL_STATE);
    });
  });
});
