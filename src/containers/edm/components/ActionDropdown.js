import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { SplitButton, Button, MenuItem } from 'react-bootstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { DataApi } from 'loom-data';

import { PermissionsPropType, getPermissions } from '../../permissions/PermissionsStorage';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import { getEdmObjectSilent, createEntitySetReference } from '../../edm/EdmStorage';
import FileConsts from '../../../utils/Consts/FileConsts';
import PageConsts from '../../../utils/Consts/PageConsts';

class ActionDropdown extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    showDetails: PropTypes.bool,
    className: PropTypes.string,
    onRequestPermissions: PropTypes.func.isRequired,
    // Async props
    entityTypeId: PropTypes.string,
    propertyTypePermissions: PropTypes.arrayOf(PermissionsPropType)
  };

  canRequestPermissions() {
    const { propertyTypePermissions } = this.props;

    if (propertyTypePermissions) {
      return !propertyTypePermissions.every(permission => permission.READ);
    } else {
      return false;
    }
  }

  renderRequestPermissions() {
    const { entitySetId, onRequestPermissions } = this.props;

    if (this.canRequestPermissions()) {
      return (
        <MenuItem onSelect={() => { onRequestPermissions(entitySetId); }}>
          Request Permissions
        </MenuItem>
      );
    } else {
      return null;
    }
  }

  renderViewDetails() {
    if (this.props.showDetails) {
      return (
        <li role="presentation">
          <Link to={`/entitysets/${entitySetId}`}>
            View Details
          </Link>
        </li>
      );
    } else {
      return null;
    }
  }

  render() {
    const { entitySetId, entityTypeId } = this.props;

    return (
      <SplitButton pullRight title="Actions" id="action-dropdown" className={classnames(this.props.className)}>
        {this.renderViewDetails()}
        {this.renderRequestPermissions()}
        <MenuItem header>Download</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.CSV)}>CSV</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.JSON)}>JSON</MenuItem>
        <MenuItem divider/>
        <li role="presentation">
          <Link
            to={{
              pathname: `/${PageConsts.VISUALIZE}`,
              query: {
                setId: entitySetId,
                typeId: entityTypeId
              }
            }}>
            Visualize
          </Link>
        </li>
      </SplitButton>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData').toJS(),
    permissions = state.get('permissions');

  const { entitySetId } = ownProps;

  let propertyTypePermissions,
    entityTypeId;
  // TODO: Remove denormalization and replace with getting PropertyTypeIds directly
  const reference = createEntitySetReference(entitySetId);
  const entitySet = getEdmObjectSilent(normalizedData, reference, null);
  if (entitySet) {
    entityTypeId = entitySet.entityType.id;
    propertyTypePermissions = entitySet.entityType.properties.map(property => {
      return getPermissions(permissions, [entitySetId, property.id])
    });
  }

  return {
    propertyTypePermissions,
    entityTypeId
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    onRequestPermissions: (entitySetId) => {
      dispatch(PermissionsActionFactory.requestPermissionsModalShow(entitySetId));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionDropdown);