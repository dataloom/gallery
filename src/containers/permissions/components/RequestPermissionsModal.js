import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import classnames from 'classnames';

import * as actionFactory from '../PermissionsActionFactory';
import PropertyTypeList from '../../edm/components/PropertyTypeList';
import { getEdmObjectSilent, createEntitySetReference } from '../../edm/EdmStorage';
import { EntitySetPropType } from '../../edm/EdmModel';
import styles from './permissions.module.css';

const PROPERTY_TYPE_EDITING = {
  permissions: true
};

class RequestPermissions extends React.Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    entitySetId: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
    //Async Objects
    entitySet: EntitySetPropType,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string),
  };

  constructor(props) {
    super(props);
    this.state = {
      pidToPermissions: {}
    }
  }

  onChange = (propertyTypeId, delta) => {
    const { pidToPermissions} = this.state;
    const newPermissions = Object.assign({}, pidToPermissions);
    newPermissions[propertyTypeId] = delta.permissions;

    this.setState({ pidToPermissions: newPermissions });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { pidToPermissions } = this.state;
    const { entitySetId, onSubmit } = this.props;
    onSubmit(entitySetId, pidToPermissions);
  };

  render() {
    const { propertyTypeIds, entitySet, entitySetId, show, onHide } = this.props;

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
          <form className={styles.rqm} onSubmit={this.onSubmit}>
            <h2 className={styles.subtitle}>Select properties you want access to:</h2>
            <PropertyTypeList
              entitySetId={entitySetId}
              propertyTypeIds={propertyTypeIds}
              editing={PROPERTY_TYPE_EDITING}
              onChange={this.onChange}
            />
            <Button type="submit" bsStyle="primary" className={styles.submitButton}>Submit</Button>
          </form>
        </Modal.Body>
      </Modal>
    );
  }
}

function mapStateToProps(state) {
  const normalizedData = state.get('normalizedData').toJS(),
    permissions = state.get('permissions');

  const entitySetId = permissions.getIn(['requestPermissionsModal', 'entitySetId']);
  let propertyTypeIds,
    entitySet;
  if (entitySetId) {
    // TODO: Remove denormalization and replace with getting PropertyTypeIds directly
    const reference = createEntitySetReference(entitySetId);
    entitySet = getEdmObjectSilent(normalizedData, reference, null);
    if (entitySet && entitySet.entityType) {
      propertyTypeIds = entitySet.entityType.properties.map(property => property.id);
    }
  }

  return {
    propertyTypeIds,
    entitySetId,
    entitySet,
    show: permissions.getIn(['requestPermissionsModal', 'show'])
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    onHide: () => { dispatch(actionFactory.requestPermissionsModalHide()); },
    onSubmit: (entitySetId, pidsToPermissions) => {
      const authnRequests = Object.keys(pidsToPermissions).map(pid => {
        const permissions = classnames(pidsToPermissions[pid]).split(' ');
        return {
          aclKey: [entitySetId, pid],
          permissions
        }
      });
      dispatch(actionFactory.submitAuthNRequest(authnRequests))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RequestPermissions);
