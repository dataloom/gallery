import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';

import { PropertyTypePropType } from '../../EdmModel';
import { PermissionsPropType } from '../../../permissions/PermissionsStorage';
import PermissionsPanel from '../../../../views/Main/Schemas/Components/PermissionsPanel';

import styles from '../../../entitysetdetail/entitysetdetail.module.css';


export default class PropertyTypeControls extends React.Component {
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
