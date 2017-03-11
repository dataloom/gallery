import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';

import { PropertyTypePropType } from '../../EdmModel';
import { createPropertyTypeReference, getEdmObjectSilent } from '../../EdmStorage';
import { PermissionsPropType, getPermissions } from '../../../permissions/PermissionsStorage';
import { PermissionsPanel } from '../../../../views/Main/Schemas/Components/PermissionsPanel';
import PropertyTypePermissions from './PropertyTypePermissions';
import PropertyTypeTitle from './PropertyTypeTitle';
import PropertyTypeDescription from './PropertyTypeDescription';

import styles from '../../../entitysetdetail/entitysetdetail.module.css';
// Default styles
import '../propertype.module.css';

export const EditingPropType = PropTypes.shape({
  permissions: PropTypes.bool
});

export const DEFAULT_EDITING = {
  permissions: false
};

/* Controls */
class PropertyTypeControls extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,

    // Async Properties
    propertyType: PropertyTypePropType,
    permissions: PermissionsPropType
  };

  constructor(props) {
    super(props);
    this.state = {
      editingPermissions: false
    };
  }

  render() {
    if (this.props.permissions.OWNER) {
      return (
        <div className="propertyTypeControls">
          <Button
              bsStyle="info"
              onClick={this.openPermissionsPanel}
              className={styles.control}>Manage Permissions</Button>
          { this.renderPermissionsPanel() }
        </div>
      );
    }
    return null;
  }

  // TODO: Move to global permissions panel
  renderPermissionsPanel() {
    const { propertyType, entitySetId } = this.props;

    if (!propertyType) return null;
    return (
      <Modal
          show={this.state.editingPermissions}
          onHide={this.closePermissionsPanel}>
        <Modal.Header closeButton>
          <Modal.Title>Manage permissions for property type: {propertyType.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PermissionsPanel
              entitySetId={entitySetId}
              propertyTypeId={propertyType.id} />
        </Modal.Body>
      </Modal>
    );
  }

  openPermissionsPanel = () => {
    this.setState({ editingPermissions: true });
  };

  closePermissionsPanel = () => {
    this.setState({ editingPermissions: false });
  };
}


// TODO: Make PropertyType a container that takes a PropertyType reference
class PropertyType extends React.Component {
  static propTypes = {
    propertyTypeId: PropTypes.string.isRequired,
    editing: EditingPropType,
    onChange: PropTypes.func,
    // Permissions are per-EntitySet. Passing entitySetId implies display permissions
    entitySetId: PropTypes.string,
    // Async Properties
    propertyType: PropertyTypePropType,
    permissions: PermissionsPropType
  };

  static defaultProps = {
    editing: DEFAULT_EDITING
  };

  render() {
    const { propertyType, entitySetId, permissions, editing, onChange } = this.props;

    return (
      <div className="propertyType">
        <PropertyTypePermissions
            propertyType={propertyType}
            permissions={permissions}
            editing={editing.permissions}
            onChange={onChange} />
        <PropertyTypeTitle propertyType={propertyType} />
        <PropertyTypeDescription propertyType={propertyType} />
        <PropertyTypeControls entitySetId={entitySetId} propertyType={propertyType} permissions={permissions} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData');
  const permissionsState = state.get('permissions');

  const { entitySetId, propertyTypeId } = ownProps;

  let { permissions, propertyType } = ownProps;

  if (!permissions && entitySetId) {
    // TODO: Make permissions handle async states properly
    permissions = getPermissions(permissionsState, [entitySetId, propertyTypeId]);
  }

  if (!propertyType) {
    const reference = createPropertyTypeReference(propertyTypeId);
    propertyType = getEdmObjectSilent(normalizedData.toJS(), reference, null);
  }

  return {
    propertyType,
    permissions
  };
}

export default connect(mapStateToProps)(PropertyType);
