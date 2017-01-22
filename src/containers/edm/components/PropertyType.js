import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import FontAwesome from 'react-fontawesome';
import { Checkbox } from 'react-bootstrap'

import { PropertyTypePropType } from '../EdmModel';
import { createPropertyTypeReference, getEdmObjectSilent } from '../EdmStorage';
import { PermissionsPropType, getPermissions } from '../../permissions/PermissionsStorage';
import ExpandableText from '../../../components/utils/ExpandableText';
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
    // Permissions are per-EntitySet. Passing entitySetId implies display permissions
    entitySetId: PropTypes.string,
    // Async Properties
    propertyType: PropertyTypePropType,
    permissions: PermissionsPropType
  };

  static defaultProps = {
    editing: DEFAULT_EDITING
  };

  renderPermissions() {
    const { editing, permissions } = this.props;

    let content;
    const canRead = permissions && permissions.READ;
    if (editing.permissions) {
      // TODO: Support more than just read
      // TODO: Enforce entitySetId on edit
      content = (<input type="checkbox" defaultChecked={true}/>);
    } else if (!canRead) {
      content = (<FontAwesome name="lock"/>);
    }

    const classes = classnames("propertyTypePermissions", {
      editing: editing.permissions
    });
    return (<div className={classes}>{content}</div>);
  }

  renderTitle() {
    const { propertyType } = this.props;

    const content = propertyType ? propertyType.title : null;
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

  render() {
    return (
      <div className="propertyType">
        {this.renderPermissions()}
        {this.renderTitle()}
        {this.renderDescription()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData'),
    permissionsState = state.get('permissions');

  const { entitySetId, propertyTypeId } = ownProps;
  const reference = createPropertyTypeReference(propertyTypeId);

  let permissions;
  if (entitySetId) {
    // TODO: Make permissions handle async states properly
    permissions = getPermissions(permissionsState, [entitySetId, propertyTypeId]);
  }

  return {
    propertyType: getEdmObjectSilent(normalizedData.toJS(), reference, null),
    permissions
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyType);