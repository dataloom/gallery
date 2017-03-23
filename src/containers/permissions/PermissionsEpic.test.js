import { RequestsApi, AuthorizationApi } from 'loom-data';
import { expect } from 'chai';
import '../../../config/chai/chai.config';

import testEpic from '../../../test/testEpic';
import * as PermissionsActionFactory from './PermissionsActionFactory';
import PermissionsEpic from './PermissionsEpic';
import { createAuthnAsyncReference } from './PermissionsStorage';
import * as AsyncActionFactory from '../async/AsyncActionFactory';


describe('PermissionsEpic', function() {
  const status = {
    status: 'APPROVED',
    aclKey: ['abc', '123'],
    permissions: ['READ'],
    principal: {
      type: 'principal-type',
      id: 'principal-id'
    }
  };

  describe('authorizationCheck', function() {
    let checkAuthorizations;

    beforeEach(function() {
      checkAuthorizations = sinon.stub(AuthorizationApi, 'checkAuthorizations');
    });

    afterEach(function() {
      AuthorizationApi.checkAuthorizations.restore();
    });

    it('should emit asyncReference', function(done) {
      const authorization = {
        aclKey: ['abc'],
        permissions: {
          DISCOVER: true,
          LINK: true,
          READ: true,
          WRITE: true,
          OWNER: true
        }
      };
      checkAuthorizations.returns(Promise.resolve([authorization]));

      const action = PermissionsActionFactory.checkAuthorizationRequest([{
        aclKey: authorization.aclKey,
        permissions: ['DISCOVER', 'LINK', 'READ', 'WRITE', 'OWNER']
      }]);
      const expectedAction = AsyncActionFactory.updateAsyncReference(
        createAuthnAsyncReference(authorization.aclKey), authorization);

      testEpic(PermissionsEpic, 2, action, (actions) => {
        expect(actions).to.deep.include(expectedAction);
        done();
      });
    });
  });

  describe('updateStatuses', function() {
    let updateRequestStatuses;

    before(function() {
      updateRequestStatuses = sinon.stub(RequestsApi, 'updateRequestStatuses');
      updateRequestStatuses.returns(Promise.resolve());
    });

    after(function() {
      RequestsApi.updateRequestStatuses.restore();
    });

    it('should return statuses updateStatusesRequest', function(done) {
      const action = PermissionsActionFactory.updateStatusesRequest([status]);
      const expectedAction = PermissionsActionFactory.updateStatusSuccess(status);

      testEpic(PermissionsEpic, 1, action, (actions) => {
        expect(actions[0]).to.be.deep.equal(expectedAction);
        expect(updateRequestStatuses).to.have.been.calledWith([status]);
        done();
      });
    });
  });

});
