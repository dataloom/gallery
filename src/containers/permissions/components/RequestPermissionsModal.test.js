import React from 'react';
import { expect } from 'chai';
import '../../../../config/chai/chai.config';

import { mapDispatchToProps } from './RequestPermissionsModal';
import * as PermissionsActionFactory from '../PermissionsActionFactory';


describe('RequestPermissionsModal', function() {
  const entitySetId = 'entity123';
  const READ_PERMISSION_REQUESTED = ['READ'];


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
