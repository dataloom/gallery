import React from 'react';

import { Map, fromJS } from 'immutable';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import isFunction from 'lodash/isFunction';

import { PermissionsPropType, PERMISSIONS } from '../../../permissions/PermissionsStorage';

export class PropertyTypePermissionsStatic extends React.Component {

  static propTypes = {
    permissions: PermissionsPropType
  };

  render() {
    const { permissions } = this.props;
    const canRead = permissions && permissions.READ;

    return (
      <div className="propertyTypePermissions">
        { canRead ? null : <FontAwesome name="lock" />}
      </div>
    );
  }
}

export class PropertyTypeEditPermissions extends React.Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    // Async Properties
    propertyType: PropTypes.instanceOf(Map).isRequired,
    permissions: PermissionsPropType
  };

  // TODO: Handle more than just read
  // THIS IS USED IN REQUEST PERMISSIONS MODAL
  onChange = (event) => {
    const { onChange, propertyType } = this.props;
    const checked = event.target.checked;

    const requestedPermissions = [];
    if (checked) {
      requestedPermissions.push(PERMISSIONS.READ);
    }

    onChange(propertyType.get('id'), requestedPermissions);
  };

  render() {
    const { permissions, propertyType } = this.props;

    const canRead = permissions && permissions.READ;
    // TODO: Support more than just read
    // TODO: Enforce entitySetId on edit
    return (
      <div className="propertyTypePermissions editing">
        <input
            type="checkbox"
            id={`ptp-${propertyType.get('id')}`}
            onChange={this.onChange}
            defaultChecked={canRead}
            disabled={!!canRead} />
      </div>
    );
  }
}

export default class PropertyTypePermissions extends React.Component {

  static propTypes = {
    editing: PropTypes.bool,
    onChange: (props) => {
      const { editing, onChange } = props;
      if (editing && !isFunction(onChange)) {
        throw new Error('If "editing" is true, "onChange" must be a function');
      }
    },
    // Async Properties
    propertyType: PropTypes.instanceOf(Map).isRequired,
    permissions: PermissionsPropType
  };

  static defaultProps = {
    onChange: () => {},
    editing: false
  };

  shouldComponentUpdate(nextProps) {

    const shouldUpdate = (
      nextProps.editing !== this.props.editing
      || !nextProps.propertyType.equals(this.props.propertyType)
      || !fromJS(nextProps.permissions).equals(fromJS(this.props.permissions))
    );

    return shouldUpdate;
  }

  render() {
    const { permissions, editing } = this.props;

    if (editing) {
      const { propertyType, onChange } = this.props;
      return (
        <PropertyTypeEditPermissions
            onChange={onChange}
            permissions={permissions}
            propertyType={propertyType} />
      );
    }

    return (<PropertyTypePermissionsStatic permissions={permissions} />);
  }
}
