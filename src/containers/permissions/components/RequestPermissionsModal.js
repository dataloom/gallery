import React, { PropTypes } from 'react';

import Immutable from 'immutable';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Modal, Alert } from 'react-bootstrap';

import AsyncContent from '../../../components/asynccontent/AsyncContent';
import * as actionFactory from '../PermissionsActionFactory';
import { EntitySetPropType } from '../../edm/EdmModel';
import RequestPermissionsForm from './RequestPermissionsForm';

class RequestPermissionsModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    entitySetId: PropTypes.string,
    reason: PropTypes.string.isRequired,
    pidToRequestedPermissions: PropTypes.instanceOf(Immutable.Map).isRequired,

    onSubmit: PropTypes.func.isRequired,
    onReasonChange: PropTypes.func.isRequired,
    onPermissionChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,

    asyncStatus: PropTypes.symbol.isRequired,
    // Async Objects
    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired,
    propertyTypeIds: PropTypes.instanceOf(Immutable.List).isRequired
  };

  render() {
    const {
      propertyTypeIds,
      reason,
      pidToRequestedPermissions,
      onReasonChange,
      onPermissionChange,
      onSubmit,
      entitySet,
      entitySetId,
      show,
      onHide,
      asyncStatus } = this.props;

    if (!entitySetId) return null;

    let title;
    if (entitySet) {
      title = `Request permissions on "${entitySet.get('title')}"`;
    }

    return (
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{ title }</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AsyncContent
              status={asyncStatus}
              pendingContent={
                <RequestPermissionsForm
                    entitySetId={entitySetId}
                    propertyTypeIds={propertyTypeIds}
                    reason={reason}
                    pidToRequestedPermissions={pidToRequestedPermissions}
                    onReasonChange={onReasonChange}
                    onPermissionChange={onPermissionChange}
                    onSubmit={onSubmit} />
              }
              content={<Alert bsStyle="success">Request made</Alert>}
              errorMessage="Failed to make request" />
        </Modal.Body>
      </Modal>
    );
  }
}

function mapStateToProps(state :Map) {

  const permissions = state.get('permissions');
  const entitySetId = permissions.getIn(['requestPermissionsModal', 'entitySetId']);
  const modalState = permissions.get('requestPermissionsModal');

  let entitySet :Map = Immutable.Map();
  let propertyTypeIds :List = Immutable.List();

  if (entitySetId) {
    entitySet = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());
    const entityTypeId :string = entitySet.get('entityTypeId');
    const entityType :Map = state.getIn(['edm', 'entityTypes', entityTypeId], Immutable.Map());
    if (!entityType.isEmpty()) {
      propertyTypeIds = entityType.get('properties');
    }
  }

  return {
    propertyTypeIds,
    entitySetId,
    entitySet,
    pidToRequestedPermissions: modalState.get('pidToRequestedPermissions'),
    reason: modalState.get('reason'),
    show: modalState.get('show'),
    asyncStatus: modalState.get('asyncStatus')
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onHide: actionFactory.requestPermissionsModalHide,
    onSubmit: actionFactory.submitAuthNRequest,
    onReasonChange: actionFactory.requestPermissionsUpdateReason,
    onPermissionChange: actionFactory.requestPermissionsUpdateRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPermissionsModal);
