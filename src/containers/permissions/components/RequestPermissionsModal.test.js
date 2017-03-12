import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import '../../../../config/chai/plugins.config';

import { ASYNC_STATUS } from '../../../components/asynccontent/AsyncContent';
import { RequestPermissionsModal, mapDispatchToProps } from './RequestPermissionsModal';
import * as PermissionsActionFactory from '../PermissionsActionFactory';


describe('RequestPermissionsModal', function() {
  const entitySetId = 'entity123';
  const READ_PERMISSION_REQUESTED = ['READ'];
  const EMPTY_PERMISSIONS_REQUESTED = [];

  let onHide;
  let onSubmit;
  let wrapper;

  beforeEach(function() {
    onHide = sinon.spy();
    onSubmit = sinon.spy();
    wrapper = shallow(
      <RequestPermissionsModal
          show
          entitySetId={entitySetId}
          onHide={onHide}
          onSubmit={onSubmit}
          asyncStatus={ASYNC_STATUS.PENDING} />
    );
  });


  it('should store permissions request', function () {
    const pid = 'abc';

    wrapper.instance().onChange(pid, READ_PERMISSION_REQUESTED);

    expect(wrapper.instance().state).to.have.property('pidToPermissionsRequests')
      .with.property(pid).equal(READ_PERMISSION_REQUESTED);
  });


  it('should update permissions requests', function () {
    const pid = 'abc';
    const permissionRequest = ['READ', 'WRITE'];

    wrapper.instance().onChange(pid, READ_PERMISSION_REQUESTED);
    wrapper.instance().onChange(pid, permissionRequest);

    expect(wrapper.instance().state).to.have.property('pidToPermissionsRequests')
      .with.property(pid).equal(permissionRequest);
  });


  it('should remove empty permissions requests', function () {
    const pid = 'abc';

    wrapper.instance().onChange(pid, READ_PERMISSION_REQUESTED);
    wrapper.instance().onChange(pid, EMPTY_PERMISSIONS_REQUESTED);

    expect(wrapper.instance().state).to.have.property('pidToPermissionsRequests')
      .and.to.not.have.property(pid);
  });


  // TODO: Refactor AsyncComponent to allow shallow testing of form events
  it('should update reason', function () {
    const reason = 'reason';
    wrapper.instance().onReasonChange({ target: { value: reason } });

    expect(wrapper).to.have.state('reason').equal(reason);
  });


  it('should submit permissions requests', function () {
    const reason = 'reason';
    const pid = 'abc';

    wrapper.instance().onChange(pid, READ_PERMISSION_REQUESTED);
    wrapper.instance().onReasonChange({ target: { value: reason } });
    wrapper.instance().onSubmit({ preventDefault: () => {} });

    const authNRequest = {
      reason,
      permissions: READ_PERMISSION_REQUESTED,
      aclKey: [entitySetId, pid]
    };

    expect(onSubmit).to.have.been.calledWith([authNRequest]);
  });

  it('should not submit unchecked permissions requests', function() {
    const reason = 'reason';
    const pid = 'abc';
    const pid2 = 'def';

    wrapper.instance().onReasonChange({ target: { value: reason } });
    wrapper.instance().onChange(pid, READ_PERMISSION_REQUESTED);
    wrapper.instance().onChange(pid2, READ_PERMISSION_REQUESTED);
    wrapper.instance().onChange(pid2, EMPTY_PERMISSIONS_REQUESTED);
    wrapper.instance().onSubmit({ preventDefault: () => {} });

    const authNRequest = {
      reason,
      permissions: READ_PERMISSION_REQUESTED,
      aclKey: [entitySetId, pid]
    };

    expect(onSubmit).to.have.been.calledWith([authNRequest]);
  });

  describe('mapDispatchToProps', function() {
    let dispatch;
    let mappedProps;

    beforeEach(function() {
      dispatch = sinon.spy();
      mappedProps = mapDispatchToProps(dispatch);
    });

    describe('onSubmit', function() {
      it('should dispatch authNRequest', function() {
        const authNRequest = {
          aclKey: [entitySetId, 'abc'],
          permissions: READ_PERMISSION_REQUESTED,
          reason: 'a reason'
        };

        mappedProps.onSubmit([authNRequest]);

        expect(dispatch).to.have.been.calledWith(PermissionsActionFactory.submitAuthNRequest([authNRequest]));
      });
    });
  });
});
