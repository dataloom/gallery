import { expect } from 'chai';
import '../../../config/chai/chai.config';

import Immutable from 'immutable';
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

  describe('Get permissions', function() {
    it('should get role permissions', function() {
      const action = PSActionFactory.setRolePermissions(property, data);
      const permissions = getRolePermissions(action);
      const result = {
        AuthenticatedUser: ['None'],
        foo: ['Link']
      };

      expect(permissions).to.eql(result);
    });

    it('should get user permissions', function() {
      const action = PSActionFactory.setUserPermissions(property, data);
      const permissions = getUserPermissions(action, Immutable.fromJS(allUsersById));
      const result = [
        {
          email: 'foo',
          id: 'auth0|foo',
          individualPermissions: ['Write'],
          nickname: 'bar',
          permissions: ['Write', 'Link'],
          roles: ['foo']
        }
      ];

      // TODO: Reformat to accept different order in array e.g. permissions
      expect(permissions).to.deep.eql(result);
    });
  });
});
