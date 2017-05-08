import { expect } from 'chai';
import '../../../../config/chai/chai.config';

import * as PSActionFactory from '../PermissionsSummaryActionFactory';
import { mapDispatchToProps } from './AllPermissions';

describe('PermissionsSummary Component', function() {
  const id = 'id';

  describe('mapDispatchToProps', function() {
    let dispatch;
    let mappedProps;
    let entitySet;

    beforeEach(function() {
      dispatch = sinon.spy();
      mappedProps = mapDispatchToProps(dispatch);
      const entitySet = {};
    });

    describe('getAllUsersAndRolesRequest', function() {

      it('should dispatch getAllUsersAndRolesRequest', function() {
        mappedProps.actions.getAllUsersAndRolesRequest();

        expect(dispatch).to.have.been.calledWith(PSActionFactory.getAllUsersAndRolesRequest(entitySet));
      });
    });
  });
});
