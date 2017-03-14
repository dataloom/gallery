import { expect } from 'chai';
import { ActionsObservable } from 'redux-observable/lib/ActionsObservable';
import '../../../config/chai/plugins.config';

import { RequestsApi } from 'loom-data';
import * as PermissionsActionFactory from './PermissionsActionFactory';
import { updateStatusesEpic, updateStatuses } from './PermissionsEpic';


describe('PermissionsEpic', function() {
  let server;

  before(function() {
    server = sinon.fakeServer.create();
    server.respondWith([200, { 'Content-Type': 'application/json' }, '']);
  });
  after(function () {
    server.restore();
  });

  describe('updateStatusesEpic', function() {
    const action = PermissionsActionFactory.updateStatusesRequest([status]);

    describe('updateStatuses', function() {
      let status;

      before(function() {
        status = {
          status: 'APPROVED',
          aclKey: ['abc', '123'],
          permissions: ['READ'],
          principal: {
            type: 'principal-type',
            id: 'principal-id'
          }
        };
      });

      it('should integrate with loom-data', function() {
        const promise = RequestsApi.updateRequestStatuses([status]);
        expect(promise).to.eventually.be.fulfilled;
      });

      it('should send status', function() {
        const mockApi = sinon.stub(RequestsApi, 'updateRequestStatuses');
        mockApi.returns(Promise.resolve());
        const observable = updateStatuses([status]);

        expect(mockApi).to.have.been.calledWith([status]);
      });
    });
  });

});
