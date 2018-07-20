import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { SplitButton, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link, hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import DropdownSearchBox from '../../../containers/entitysetsearch/DropdownSearchBox';
import PageConsts from '../../../utils/Consts/PageConsts';

import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';

import { createAsyncComponent } from '../../async/components/AsyncContentComponent';
import { createAuthnAsyncReference, createAccessCheck } from '../../permissions/PermissionsStorage';
import { createEntityTypeAsyncReference } from '../EdmAsyncStorage';
import { EntityTypePropType } from '../EdmModel';

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
        { this.renderViewDetails() }
        { this.renderRequestPermissions() }
        <MenuItem divider />
        <li role="presentation">
          <Link
              to={{
                pathname: `/${PageConsts.ENTITY_SETS}/${this.props.entitySetId}/toputilizers`
              }}>
            Find Top Utilizers
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

    // TODO - this can be improved. when there's multiple of these on the page, a new request will be fired off
    // to load permissions. there should be a way to combine all of these requests into a single request (perhaps with
    // rxjs Observables)
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

  const { entitySetId } = ownProps;

  const entitySet = state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map());
  let entityTypeAsyncReference;

  if (!entitySet.isEmpty()) {
    entityTypeAsyncReference = createEntityTypeAsyncReference(entitySet.get('entityTypeId'));
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
