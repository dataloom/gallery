import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { PropertyTypePropType } from '../../EdmModel';
import { createPropertyTypeReference, getEdmObjectSilent } from '../../EdmStorage';
import { PermissionsPropType, getPermissions } from '../../../permissions/PermissionsStorage';
import PropertyTypePermissions from './PropertyTypePermissions';
import PropertyTypeTitle from './PropertyTypeTitle';
import PropertyTypeDescription from './PropertyTypeDescription';
import PropertyTypeControls from './PropertyTypeControls';

// Default styles
import '../propertype.module.css';

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
