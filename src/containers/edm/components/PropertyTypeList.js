/*
 * @flow
 */

import React from 'react';

import classnames from 'classnames';
import Immutable from 'immutable';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import PropertyType, { EditingPropType, DEFAULT_EDITING } from './propertytype/PropertyType';
import { checkAuthorizationRequest } from '../../permissions/PermissionsActionFactory';
import { createAccessCheck } from '../../permissions/PermissionsStorage';

class PropertyTypeList extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    propertyTypeIds: PropTypes.instanceOf(Immutable.List).isRequired,
    editing: EditingPropType,
    onChange: PropTypes.func,
    // Implies permissions view
    entitySetId: PropTypes.string,
    loadPermissions: PropTypes.func.isRequired,
    requestingPermissions: PropTypes.bool
  };

  static defaultProps = {
    display: DEFAULT_EDITING
  };

  componentDidMount() {
    this.props.loadPermissions();
  }

  renderContent() {

    if (this.props.propertyTypeIds.isEmpty()) {
      return (<em>No property types</em>);
    }

    const propertyTypes = [];
    this.props.propertyTypeIds.forEach((propertyTypeId :string) => {
      propertyTypes.push(
        <PropertyType
            entitySetId={this.props.entitySetId}
            editing={this.props.editing}
            propertyTypeId={propertyTypeId}
            key={propertyTypeId}
            onChange={this.props.onChange}
            requestingPermissions={this.props.requestingPermissions} />
      );
    });

    return propertyTypes;
  }

  render() {
    const { className } = this.props;

    return (
      <div className={classnames('propertyTypeList', className)}>
        <div className="propertyTypeListHeader">
          <div className="propertyTypeListPermissions" />
          <div className="propertyTypeTitle">Property Title</div>
          <div className="propertyTypeListDescription">Description</div>
          <div className="propertyTypeListControls" />
        </div>
        {this.renderContent()}
      </div>
    );
  }
}

function mapDispatchToProps(dispatch, ownProps) {

  const { entitySetId, propertyTypeIds } = ownProps;

  let loadPermissions;
  if (entitySetId) {
    // const accessChecks = propertyTypeIds.map((id) => {
    //   return createAccessCheck([entitySetId, id]);
    // });
    const accessChecks = [];
    propertyTypeIds.forEach((propertyTypeId :string) => {
      accessChecks.push(createAccessCheck([entitySetId, propertyTypeId]));
    });
    loadPermissions = () => {
      dispatch(checkAuthorizationRequest(accessChecks));
    };
  }
  else {
    loadPermissions = () => {};
  }

  return {
    loadPermissions
  };
}

export default connect(null, mapDispatchToProps)(PropertyTypeList);
