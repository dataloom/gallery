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

  constructor(props) {
    super(props);
    this.state = {
      editingPermissions: false
    };
  }

  // TODO: Handle more than just permissions
  onChange = (event) => {
    const { onChange } = this.props,
      canRead = event.target.value == 'on';

    if (onChange && canRead) {
      onChange({
        permissions: canRead
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
      content = (<input type="checkbox" id={`ptp-${propertyType.id}`} onChange={this.onChange} defaultChecked={canRead}/>);
    } else if (!canRead) {
      content = (<FontAwesome name="lock"/>);
    }

    const classes = classnames("propertyTypePermissions", {
      editing: editing.permissions
    });
    return (<div className={classes}>{content}</div>);
  }

  renderTitle() {
    const { editing, propertyType } = this.props;

    let content;
    if (propertyType) {
      if (editing.permissions) {
        content = (
          <label htmlFor={`ptp-${propertyType.id}`}>{propertyType.title}</label>
        )
      } else {
        content = propertyType.title;
      }
    }
    return (<div className="propertyTypeTitle">{content}</div>);
  }

  renderDescription() {
    const { propertyType } = this.props;

    let content;
    if (propertyType) {
      if (propertyType.description) {
        content = (<ExpandableText text={propertyType.description} maxLength={MAX_DESCRIPTION_LENGTH}/>);
      } else {
        content = (<em>No description</em>);
      }
    }

    return (<div className="propertyTypeDescription">{content}</div>);
  }

  setEditingPermissions = () => {
    this.setState({ editingPermissions: true });
  }

  closePermissionsPanel = () => {
    this.setState({ editingPermissions: false });
  }

  renderManagePermissions() {
    if (this.props.permissions.OWNER) {
      return (<Button
          bsStyle="info"
          onClick={this.setEditingPermissions}
          className={styles.control}>Manage Permissions</Button>);
    }
    return null;
  }

  renderPermissionsPanel() {
    if (!this.props.propertyType) return null;
    return (
      <Modal
          show={this.state.editingPermissions}
          onHide={this.closePermissionsPanel}>
        <Modal.Header closeButton>
          <Modal.Title>Manage permissions for property type: {this.props.propertyType.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PermissionsPanel
              entitySetId={this.props.entitySetId}
              propertyTypeId={this.props.propertyTypeId} />
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    return (
      <div className="propertyType">
        {this.renderPermissions()}
        {this.renderTitle()}
        {this.renderDescription()}
        {this.renderManagePermissions()}
        {this.renderPermissionsPanel()}
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

function mapDispatchToProps(dispatch, ownProps) {
  const { entitySetId, propertyTypeId } = ownProps;

  let onChange;
  if (entitySetId) {
    onChange = (property) => {
      const canRead = property.permissions;

      if (canRead) {
        const request = {
          aclKey: [entitySetId, propertyTypeId],
          permissions: ["READ"]
        };
        dispatch(PermissionsActionFactory.requestPermissionsRequest([request]));
      }
    }
  }

  return {
    onChange
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyType);
