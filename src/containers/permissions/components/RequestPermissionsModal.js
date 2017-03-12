import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Modal, Button, Alert, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import classnames from 'classnames';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';

import AsyncContent from '../../../components/asynccontent/AsyncContent';
import * as actionFactory from '../PermissionsActionFactory';
import PropertyTypeList from '../../edm/components/PropertyTypeList';
import { getEdmObjectSilent, createEntitySetReference } from '../../edm/EdmStorage';
import { EntitySetPropType } from '../../edm/EdmModel';
import styles from './permissions.module.css';

const PROPERTY_TYPE_EDITING = {
  permissions: true
};

export class RequestPermissionsModal extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    entitySetId: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    asyncStatus: PropTypes.symbol.isRequired,
    // Async Objects
    entitySet: EntitySetPropType,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string)
  };

  // TODO: Move state to redux
  constructor(props) {
    super(props);
    this.state = {
      pidToPermissionsRequests: {},
      reason: ''
    };
  }

  onChange = (propertyTypeId, requestedPermissions) => {
    const { pidToPermissionsRequests } = this.state;
    const newRequests = Object.assign({}, pidToPermissionsRequests);

    if (isEmpty(requestedPermissions)) {
      delete newRequests[propertyTypeId];
    } else {
      newRequests[propertyTypeId] = requestedPermissions;
    }

    this.setState({ pidToPermissionsRequests: newRequests });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { pidToPermissionsRequests, reason } = this.state;
    const { entitySetId, onSubmit } = this.props;

    const authNRequests = map(pidToPermissionsRequests, (permissions, pid) => {
      return {
        aclKey: [entitySetId, pid],
        permissions,
        reason
      };
    });
    onSubmit(authNRequests);
  };

  onReasonChange = (event) => {
    this.setState({ reason: event.target.value });
  };

  render() {
    const { propertyTypeIds, entitySet, entitySetId, show, onHide, asyncStatus } = this.props;

    let title;
    if (entitySet) {
      title = `Request permissions on "${entitySet.title}"`;
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
                <form className={styles.rqm} onSubmit={this.onSubmit}>
                  <FormGroup>
                    <ControlLabel>Reason for your request</ControlLabel>
                    <FormControl componentClass="textarea" onChange={this.onReasonChange} />
                  </FormGroup>
                  <h2 className={styles.subtitle}>Select properties you want access to:</h2>
                  <PropertyTypeList
                      entitySetId={entitySetId}
                      propertyTypeIds={propertyTypeIds}
                      editing={PROPERTY_TYPE_EDITING}
                      onChange={this.onChange} />
                  <Button type="submit" bsStyle="primary" className={styles.submitButton}>Submit</Button>
                </form>
              }
              content={<Alert bsStyle="success">Request made</Alert>}
              errorMessage="Failed to make request" />
        </Modal.Body>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const normalizedData = state.get('normalizedData').toJS();
  const permissions = state.get('permissions');

  const entitySetId = permissions.getIn(['requestPermissionsModal', 'entitySetId']);
  let propertyTypeIds;
  let entitySet;

  if (entitySetId) {
    // TODO: Remove denormalization and replace with getting PropertyTypeIds directly
    const reference = createEntitySetReference(entitySetId);
    entitySet = getEdmObjectSilent(normalizedData, reference, null);
    if (entitySet && entitySet.entityType) {
      propertyTypeIds = entitySet.entityType.properties.map((property) => {
        return property.id;
      });
    }
  }

  return {
    propertyTypeIds,
    entitySetId,
    entitySet,
    show: permissions.getIn(['requestPermissionsModal', 'show']),
    asyncStatus: permissions.getIn(['requestPermissionsModal', 'asyncStatus'])
  };
}

export function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onHide: actionFactory.requestPermissionsModalHide,
    onSubmit: actionFactory.submitAuthNRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPermissionsModal);
