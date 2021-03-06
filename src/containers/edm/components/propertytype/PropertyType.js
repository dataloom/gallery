import React from 'react';

import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';

import PropertyTypePermissions from './PropertyTypePermissions';
import PropertyTypeTitle from './PropertyTypeTitle';
import PropertyTypeDescription from './PropertyTypeDescription';
import PropertyTypeDatatype from './PropertyTypeDatatype';
import PropertyTypeDefaultShow from './PropertyTypeDefaultShow';
import { PermissionsPropType, getPermissions } from '../../../permissions/PermissionsStorage';

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
    propertyType: PropTypes.instanceOf(Map).isRequired,
    permissions: PermissionsPropType,
    // TODO: Move display logic to CSS
    requestingPermissions: PropTypes.bool,
    customSettings: PropTypes.object,
    isOwner: PropTypes.bool,
    updateCustomSettings: PropTypes.func
  };

  static defaultProps = {
    editing: DEFAULT_EDITING
  };

  shouldComponentUpdate(nextProps) {

    const shouldUpdate = (
      nextProps.entitySetId !== this.props.entitySetId
      || nextProps.isOwner !== this.props.isOwner
      || nextProps.requestingPermissions !== this.props.requestingPermissions
      || !nextProps.propertyType.equals(this.props.propertyType)
      || !nextProps.customSettings.equals(this.props.customSettings)
      || !fromJS(nextProps.editing).equals(fromJS(this.props.editing))
      || !fromJS(nextProps.permissions).equals(fromJS(this.props.permissions))
    );

    return shouldUpdate;
  }

  renderDatatype = () => {
    if (this.props.requestingPermissions) return null;
    return <PropertyTypeDatatype propertyType={this.props.propertyType} />;
  }

  renderDefaultShow = () => {
    if (this.props.requestingPermissions || !this.props.isOwner) return null;
    return (
      <PropertyTypeDefaultShow
          propertyType={this.props.propertyType}
          customSettings={this.props.customSettings}
          updateDefaultShow={this.updateDefaultShow} />
    );
  }

  updateTitle = (title) => {
    this.props.updateCustomSettings(this.props.entitySetId, this.props.propertyType.get('id'), { title });
  }

  updateDescription = (description) => {
    this.props.updateCustomSettings(this.props.entitySetId, this.props.propertyType.get('id'), { description });
  }

  updateDefaultShow = (defaultShow) => {
    this.props.updateCustomSettings(this.props.entitySetId, this.props.propertyType.get('id'), { defaultShow });
  }

  render() {
    const { propertyType, permissions, editing, onChange, customSettings, isOwner } = this.props;

    return (
      <div className="propertyType">
        <PropertyTypePermissions
            propertyType={propertyType}
            permissions={permissions}
            editing={editing.permissions}
            onChange={onChange} />
        <PropertyTypeTitle
            propertyType={propertyType}
            customSettings={customSettings}
            isOwner={isOwner}
            updateTitle={this.updateTitle} />
        <PropertyTypeDescription
            propertyType={propertyType}
            customSettings={customSettings}
            isOwner={isOwner}
            updateDescription={this.updateDescription} />
        {this.renderDatatype()}
        {this.renderDefaultShow()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {

  const async = state.get('async');
  const permissionsState = state.get('permissions');
  const edm = state.get('edm');

  const { entitySetId, propertyTypeId } = ownProps;
  let { permissions } = ownProps;

  if (!permissions && entitySetId) {
    // TODO: Make permissions handle async states properly
    permissions = getPermissions(permissionsState, [entitySetId, propertyTypeId]);
  }

  let propertyType;
  if (async.hasIn(['propertyTypes', propertyTypeId])) {
    // TODO: fromJS() should happen in a reducer, not here
    propertyType = fromJS(async.getIn(['propertyTypes', propertyTypeId]).value);
  }

  const customSettings = edm.getIn(['entitySetPropertyMetadata', entitySetId, propertyTypeId], Map());

  return {
    propertyType,
    permissions,
    customSettings
  };
}

export default connect(mapStateToProps)(PropertyType);
