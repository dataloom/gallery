import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { SplitButton, MenuItem } from 'react-bootstrap';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { DataApi } from 'loom-data';

import { createAuthnAsyncReference, createAccessCheck } from '../../permissions/PermissionsStorage';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import {
  getShallowEdmObjectSilent,
  createEntitySetReference,
  createEntityTypeReference
} from '../../edm/EdmStorage';
import FileConsts from '../../../utils/Consts/FileConsts';
import PageConsts from '../../../utils/Consts/PageConsts';
import AsyncContentListComponent from '../../async/components/AsyncContentListComponent';
import { AsyncReferencePropType } from '../../async/AsyncStorage';

class ActionDropdown extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    propertyTypeAuthnReferences: PropTypes.arrayOf(AsyncReferencePropType).isRequired,
    showDetails: PropTypes.bool,
    className: PropTypes.string,
    onRequestPermissions: PropTypes.func.isRequired,
    loadPropertyTypeAuthns: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { loadPropertyTypeAuthns, propertyTypeAuthnReferences} = this.props;
    const aclKeys = propertyTypeAuthnReferences.map(reference => {
      return reference.id.split('/');
    });
    loadPropertyTypeAuthns(aclKeys);
  }

  canRequestPermissions(propertyTypeAuthn) {
    return !propertyTypeAuthn.every(authn => authn.permissions.READ);
  }

  renderRequestPermissions(propertyTypeAuthn) {
    const { entitySetId, onRequestPermissions } = this.props;

    if (this.canRequestPermissions(propertyTypeAuthn)) {
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
          <Link to={`/entitysets/${this.props.entitySetId}`}>
            View Details
          </Link>
        </li>
      );
    } else {
      return null;
    }
  }

  render() {
    const { entitySetId, propertyTypeAuthnReferences } = this.props;

    return (
      <AsyncContentListComponent references={propertyTypeAuthnReferences} render={(propertyTypeAuthn) => {
        return (
          <SplitButton pullRight title="Actions" bsStyle="primary" id="action-dropdown" className={classnames(this.props.className)}>
            {this.renderViewDetails()}
            {this.renderRequestPermissions(propertyTypeAuthn)}
            <MenuItem header>Download</MenuItem>
            <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.CSV)}>CSV</MenuItem>
            <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.JSON)}>JSON</MenuItem>
            <MenuItem divider/>
            <li role="presentation">
              <Link
                to={{
                  pathname: `/${PageConsts.VISUALIZE}`,
                  query: {
                    setId: entitySetId
                  }
                }}>
                Visualize
              </Link>
            </li>
          </SplitButton>
        );
      }}/>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData').toJS();
  const { entitySetId } = ownProps;

  let propertyTypeAuthnReferences,
    entityTypeId;
  // TODO: remove denormalization and replace with AsyncReferences
  const reference = createEntitySetReference(entitySetId);
  const entitySet = getShallowEdmObjectSilent(normalizedData, reference, null);
  if (entitySet) {
    entityTypeId = entitySet.entityTypeId;
    const etReference = createEntityTypeReference(entityTypeId);
    const entityType = getShallowEdmObjectSilent(normalizedData, etReference, null);
    if (entityType && entityType.properties) {
      propertyTypeAuthnReferences = entityType.properties.map(id => {
        return createAuthnAsyncReference([entitySetId, id]);
      });
    }
  }

  return {
    propertyTypeAuthnReferences,
    entityTypeId
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return {
    onRequestPermissions: (entitySetId) => {
      dispatch(PermissionsActionFactory.requestPermissionsModalShow(entitySetId));
    },
    loadPropertyTypeAuthns: (aclKeys) => {
      const accessChecks = aclKeys.map(createAccessCheck);
      dispatch(PermissionsActionFactory.checkAuthorizationRequest(accessChecks));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionDropdown);
