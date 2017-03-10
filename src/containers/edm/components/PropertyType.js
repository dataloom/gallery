import React, { PropTypes } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';

import { PropertyTypePropType } from '../EdmModel';
import { createPropertyTypeReference, getEdmObjectSilent } from '../EdmStorage';
import { PermissionsPropType, getPermissions } from '../../permissions/PermissionsStorage';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import { PermissionsPanel } from '../../../views/Main/Schemas/Components/PermissionsPanel';
import ExpandableText from '../../../components/utils/ExpandableText';
import styles from '../../entitysetdetail/entitysetdetail.module.css';
// Default styles
import './propertype.module.css';
const MAX_DESCRIPTION_LENGTH = 300;

export const EditingPropType = PropTypes.shape({
  permissions: PropTypes.bool
});

export const DEFAULT_EDITING = {
  permissions: false
};

/* Permissions */

/* Title */
class PropertyTypeTitle extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType
  };

  render() {
    const { propertyType } = this.props;
    const content = propertyType === null ? null : propertyType.title;

    return (
      <div className="propertyTypeTitle">{content}</div>
    );
  }
}

/* Description */
class PropertyTypeDescription extends React.Component {
  static propTypes = {
    propertyType: PropertyTypePropType
  };

  render() {
    const { propertyType } = this.props;
    let content;

    if (propertyType) {
      if (propertyType.description) {
        content = (<ExpandableText text={propertyType.description} maxLength={MAX_DESCRIPTION_LENGTH} />);
      } else {
        content = (<em>No description</em>);
      }
    }

    return (<div className="propertyTypeDescription">{content}</div>);
  }
}

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

  // TODO: Handle more than just permissions
  //THIS IS USED IN REQUEST PERMISSIONS MODAL
  onChange = (event) => {
    const { onChange, propertyTypeId, permissions } = this.props,
      canRead = event.target.value === 'on';

    if (onChange && canRead) {
      const newPermissions = Object.assign({}, permissions, {
        READ: canRead
      });

      onChange(propertyTypeId, {
        permissions: newPermissions
      });
    }
  };

  renderPermissions() {
    const { editing, permissions, propertyType } = this.props;

    let content;
    const canRead = permissions && permissions.READ;
    if (editing.permissions) {
      // TODO: Support more than just read
      // TODO: Enforce entitySetId on edit
      content = (<input type="checkbox" id={`ptp-${propertyType.id}`} onChange={this.onChange} defaultChecked={canRead} disabled={!!canRead}/>);
    } else if (!canRead) {
      content = (<FontAwesome name="lock"/>);
    }

    const classes = classnames('propertyTypePermissions', {
      editing: editing.permissions
    });
    return (<div className={classes}>{content}</div>);
  }

  render() {
    const { propertyType, entitySetId, permissions } = this.props;

    return (
      <div className="propertyType">
        {this.renderPermissions()}
        <PropertyTypeTitle propertyType={propertyType} />
        <PropertyTypeDescription propertyType={propertyType} />
        <PropertyTypeControls entitySetId={entitySetId} propertyType={propertyType} permissions={permissions} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData'),
    permissionsState = state.get('permissions');

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

// function mapDispatchToProps(dispatch, ownProps) {
//   const { entitySetId, propertyTypeId } = ownProps;
//
//   let onChange;
//   if (entitySetId) {
//     onChange = (property) => {
//       const canRead = property.permissions;
//
//       if (canRead) {
//         const request = {
//           aclKey: [entitySetId, propertyTypeId],
//           permissions: ["READ"]
//         };
//         dispatch(PermissionsActionFactory.requestPermissionsRequest([request]));
//       }
//     }
//   }
//
//   return {
//     onChange
//   }
// }

export default connect(mapStateToProps)(PropertyType);
