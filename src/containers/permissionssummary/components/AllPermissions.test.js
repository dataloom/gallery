import { expect } from 'chai';
import '../../../../config/chai/chai.config';

import * as PSActionFactory from '../PermissionsSummaryActionFactory';
import * as ESDCActionFactory from '../../entitysetdetail/EntitySetDetailActionFactories';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import * as EDMActionFactory from '../../edm/EdmActionFactories';
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

    describe('loadEntitySet', function() {
      it('should dispatch entitySetDetailRequest', function() {
        mappedProps.loadEntitySet(id);

        expect(dispatch).to.have.been.calledWith(ESDCActionFactory.entitySetDetailRequest(id));
      });

      it('should dispatch getEntitySetsAuthorizations', function() {
        mappedProps.loadEntitySet(id);

        expect(dispatch).to.have.been.calledWith(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      });

      it('should dispatch filteredEdmRequest', function() {
        const data = [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }];
        mappedProps.loadEntitySet(id);

        expect(dispatch).to.have.been.calledWith(EDMActionFactory.filteredEdmRequest(data));
      });
    });

    describe('getAllUsersAndRolesRequest', function() {

      it('should dispatch getAllUsersAndRolesRequest', function() {
        mappedProps.actions.getAllUsersAndRolesRequest();

        expect(dispatch).to.have.been.calledWith(PSActionFactory.getAllUsersAndRolesRequest(entitySet));
      });
    });
  });
});
