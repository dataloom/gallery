import { RequestsApi } from 'loom-data';
import { expect } from 'chai';
import '../../../config/chai/chai.config';

import testEpic from '../../../test/testEpic';
import * as PermissionsActionFactory from './PermissionsActionFactory';
import PermissionsEpic from './PermissionsEpic';


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
