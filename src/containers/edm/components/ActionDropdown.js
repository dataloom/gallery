import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { DataApi } from 'loom-data';
import { SplitButton, MenuItem } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Link,
  hashHistory
} from 'react-router';

import {
  createAuthnAsyncReference,
  createAccessCheck,
  AuthorizationPropType
} from '../../permissions/PermissionsStorage';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import {
  getShallowEdmObjectSilent,
  createEntitySetReference
} from '../EdmStorage';
import {
  createEntityTypeAsyncReference
} from '../EdmAsyncStorage';
import {
  EntityTypePropType
} from '../EdmModel';
import {
  createAsyncComponent
} from '../../async/components/AsyncContentComponent';

import DropdownSearchBox from '../../../containers/entitysetsearch/DropdownSearchBox';
import FileConsts from '../../../utils/Consts/FileConsts';
import PageConsts from '../../../utils/Consts/PageConsts';


class ActionDropdown extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    // propertyTypeAuthorizations: PropTypes.arrayOf(AuthorizationPropType).isRequired,
    propertyTypeAuthorizations: PropTypes.array.isRequired,
    showDetails: PropTypes.bool,
    className: PropTypes.string,
    onRequestPermissions: PropTypes.func.isRequired
  };

  static defaultProps = {
    showDetails: false,
    className: null
  };

  canRequestPermissions() {
    const { propertyTypeAuthorizations } = this.props;

    return !propertyTypeAuthorizations.every((authorization) => {
      return authorization.permissions.READ;
    });
  }

  renderRequestPermissions() {
    const { entitySetId, onRequestPermissions } = this.props;

    if (this.canRequestPermissions()) {
      return (
        <MenuItem
            onSelect={() => {
              onRequestPermissions(entitySetId);
            }}>
          Request Permissions
        </MenuItem>
      );
    }
    return null;
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
    }
    return null;
  }

  goToViewDetails = () => {

    if (this.props.showDetails) {
      hashHistory.push(`/entitysets/${this.props.entitySetId}`);
    }
  };

  render() {
    const { entitySetId } = this.props;

    const title = (!this.props.showDetails) ? 'Actions' : 'View Details';

    return (
      <SplitButton
          pullRight
          title={title}
          bsStyle="primary"
          id="action-dropdown"
          className={classnames(this.props.className)}
          onClick={this.goToViewDetails}>
        {this.renderViewDetails()}
        {this.renderRequestPermissions()}
        <MenuItem header>Download</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.CSV)}>CSV</MenuItem>
        <MenuItem href={DataApi.getEntitySetDataFileUrl(entitySetId, FileConsts.JSON)}>JSON</MenuItem>
        <MenuItem divider />
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
        <MenuItem divider />
        <DropdownSearchBox entitySetId={entitySetId} />
      </SplitButton>);
  }
}
ActionDropdown.Async = createAsyncComponent(ActionDropdown);

class ActionDropdownWrapper extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    entityType: EntityTypePropType.isRequired,
    loadPropertyTypePermissions: PropTypes.func.isRequired
  };

  componentDidMount() {
    const { loadPropertyTypePermissions } = this.props;
    loadPropertyTypePermissions(this.getAclKeys());
  }

  getAclKeys() {
    const { entityType, entitySetId } = this.props;

    return entityType.properties.map((propertyTypeId) => {
      return [entitySetId, propertyTypeId];
    });
  }

  render() {
    const propertyTypeAuthorizationReferences = this.getAclKeys().map(createAuthnAsyncReference);

    return (
      <ActionDropdown.Async
          propertyTypeAuthorizations={propertyTypeAuthorizationReferences}
          {...this.props} />);
  }
}
ActionDropdownWrapper.Async = createAsyncComponent(ActionDropdownWrapper);

function mapStateToProps(state, ownProps) {
  const normalizedData = state.get('normalizedData').toJS();
  const { entitySetId } = ownProps;

  let entityTypeAsyncReference;
  // TODO: remove denormalization and replace with AsyncReferences
  const reference = createEntitySetReference(entitySetId);
  const entitySet = getShallowEdmObjectSilent(normalizedData, reference, null);

  if (entitySet) {
    entityTypeAsyncReference = createEntityTypeAsyncReference(entitySet.entityTypeId);
  }
  else {
    // TODO: replace with actual empty reference in async/
    entityTypeAsyncReference = createEntityTypeAsyncReference('');
  }

  return {
    entityType: entityTypeAsyncReference
  };
}

// TODO: Decide if/how to incorporate bindActionCreators
function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    onRequestPermissions: PermissionsActionFactory.requestPermissionsModalShow,
    loadPropertyTypePermissions: (aclKeys) => {
      const accessChecks = aclKeys.map(createAccessCheck);
      return PermissionsActionFactory.checkAuthorizationRequest(accessChecks);
    }
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionDropdownWrapper.Async);
