// @flow

import React, { PropTypes } from 'react';
import PermissionConsts from '../../core/permissions/Permission';
import FontAwesome from 'react-fontawesome';

export class PermissionIcon extends React.Component {
  static propTypes = {
    permission: PropTypes.instanceOf(PermissionConsts.Permission).isRequired,
    size: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x'])
  };

  render() {
    let size = this.props.size || 'lg';
    let icon;

    switch (this.props.permission) {
      case PermissionConsts.OWNER:
        icon = "user-o";
        break;
      case PermissionConsts.WRITE:
        icon = "pencil";
        break;
      case PermissionConsts.READ:
        icon = "eye";
        break;
      case PermissionConsts.DISCOVER:
        icon = "lock";
        break;
      default:
        return "";
    }

    return (
      <div>
        {this.props.permission}
        <FontAwesome name={icon} size={size} />
      </div>
    )
  }
}