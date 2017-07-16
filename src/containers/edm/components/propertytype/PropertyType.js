/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { PermissionsPropType, getPermissions } from '../../../permissions/PermissionsStorage';
import PropertyTypePermissions from './PropertyTypePermissions';
import PropertyTypeTitle from './PropertyTypeTitle';
import PropertyTypeDescription from './PropertyTypeDescription';
import PropertyTypeDatatype from './PropertyTypeDatatype';

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
    editing: EditingPropType,
    onChange: PropTypes.func,
    // Permissions are per-EntitySet. Passing entitySetId implies display permissions
    entitySetId: PropTypes.string,
    // Async Properties
    propertyType: PropTypes.instanceOf(Immutable.Map).isRequired,
    permissions: PermissionsPropType,
    // TODO: Move display logic to CSS
    requestingPermissions: PropTypes.bool
  };

  static defaultProps = {
    editing: DEFAULT_EDITING
  };

  render() {
    const { propertyType, permissions, editing, onChange } = this.props;
    return (
      <div className="propertyType">
        <PropertyTypePermissions
            propertyType={propertyType}
            permissions={permissions}
            editing={editing.permissions}
            onChange={onChange} />
        <PropertyTypeTitle propertyType={propertyType} />
        <PropertyTypeDescription propertyType={propertyType} />
        <PropertyTypeDatatype propertyType={propertyType} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {

  const async :Map = state.get('async');
  const permissionsState = state.get('permissions');

  const { entitySetId, propertyTypeId } = ownProps;
  let { permissions } = ownProps;

  if (!permissions && entitySetId) {
    // TODO: Make permissions handle async states properly
    permissions = getPermissions(permissionsState, [entitySetId, propertyTypeId]);
  }

  let propertyType;
  if (async.hasIn(['propertyTypes', propertyTypeId])) {
    // TODO: fromJS() should happen in a reducer, not here
    propertyType = Immutable.fromJS(async.getIn(['propertyTypes', propertyTypeId]).value);
  }

  return {
    propertyType,
    permissions
  };
}

export default connect(mapStateToProps)(PropertyType);
