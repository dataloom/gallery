import React from 'react';
import { Map } from 'immutable';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import '../../../../config/chai/plugins.config';

import RequestPermissionsForm from './RequestPermissionsForm';


describe('RequestPermissionsForm', function() {
  const entitySetId = 'entity123';
  const propertyTypeId = 'pid1'
  const propertyTypeIds = [propertyTypeId];
  const READ_PERMISSION_REQUESTED = ['READ'];

  let onSubmit;
  let onReasonChange;
  let onPermissionChange;

  beforeEach(function() {
    onReasonChange = sinon.spy();
    onPermissionChange = sinon.spy();
    onSubmit = sinon.spy();
  });


  // TODO: Refactor AsyncComponent to allow shallow testing of form events
  it('should call onChangeReason', function () {
    const wrapper = shallow(
      <RequestPermissionsForm
          entitySetId={entitySetId}
          onReasonChange={onReasonChange}
          onPermissionChange={onPermissionChange}
          onSubmit={onSubmit}
          propertyTypeIds={propertyTypeIds} />
    );
    const reason = 'reason';
    wrapper.find('FormControl').simulate('change', { target: { value: reason } });

    expect(onReasonChange).to.have.been.calledWith(reason);
  });


  it('should submit permissions requests', function () {
    const reason = 'reason';
    const pidToRequestedPermissions = Map({
      [propertyTypeId]: READ_PERMISSION_REQUESTED
    });

    const wrapper = shallow(
      <RequestPermissionsForm
          entitySetId={entitySetId}
          onReasonChange={onReasonChange}
          onPermissionChange={onPermissionChange}
          onSubmit={onSubmit}
          propertyTypeIds={propertyTypeIds}
          reason={reason}
          pidToRequestedPermissions={pidToRequestedPermissions} />
    );

    wrapper.find('form').simulate('submit', { preventDefault: () => {} });

    const authNRequest = {
      reason,
      permissions: READ_PERMISSION_REQUESTED,
      aclKey: [entitySetId, propertyTypeId]
    };
    expect(onSubmit).to.have.been.calledWith([authNRequest]);
  });

});
