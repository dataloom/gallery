import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import Page from '../../../components/page/Page';
import RolePermissionsTable from './RolePermissionsTable';
import UserPermissionsTable from './UserPermissionsTable';

import * as psActionFactory from '../PermissionsSummaryActionFactory';

import styles from '../styles.module.css';

const U_HEADERS = ['Users', 'Roles', 'Permissions'];
const R_HEADERS = ['Roles', 'Permissions'];

class AllPermissions extends React.Component {
  static propTypes = {
    actions: React.PropTypes.shape({
      getAllUsersAndRolesRequest: React.PropTypes.func.isRequired
    }).isRequired,
    entitySet: PropTypes.instanceOf(Immutable.Map).isRequired,
    entityUserPermissions: PropTypes.instanceOf(Immutable.List).isRequired,
    entityRolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    propertyPermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    isGettingUsersRoles: PropTypes.bool.isRequired,
    isGettingAcls: PropTypes.bool.isRequired,
    isGettingPermissions: PropTypes.bool.isRequired
  }

  componentDidMount() {
    if (!this.props.entitySet.isEmpty()) {
      this.props.actions.getAllUsersAndRolesRequest(this.props.entitySet.toJS());
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entitySet.isEmpty() && !nextProps.entitySet.isEmpty()) {
      this.props.actions.getAllUsersAndRolesRequest(nextProps.entitySet.toJS()); // toJS() just for now
    }
  }

  renderEntityTables() {
    return (
      <div>
        <h3>Entity Permissions</h3>
        <RolePermissionsTable
            rolePermissions={this.props.entityRolePermissions}
            headers={R_HEADERS} />
        <UserPermissionsTable
            userPermissions={this.props.entityUserPermissions}
            rolePermissions={this.props.entityRolePermissions}
            headers={U_HEADERS} />
      </div>
    );
  }

  renderPropertyTables() {
    const { propertyPermissions } = this.props;
    const tables = [];

    propertyPermissions.keySeq().forEach((property) => {
      const rolePermissions = propertyPermissions.getIn([property, 'rolePermissions'], Immutable.Map());
      const userPermissions = propertyPermissions.getIn([property, 'userPermissions'], Immutable.List());

      const header = <h3 key={`header-${property}`}>{property} Permissions</h3>;
      const roleTable = (<RolePermissionsTable
          rolePermissions={rolePermissions}
          headers={R_HEADERS}
          key={`role-${property}`} />);
      const userTable = (<UserPermissionsTable
          property={property}
          userPermissions={userPermissions}
          rolePermissions={rolePermissions}
          headers={U_HEADERS}
          key={`user-${property}`} />);

      tables.push(header, roleTable, userTable);
    });
    return tables;
  }

  renderTables() {
    return (
      <div>
        {this.renderEntityTables()}
        {this.renderPropertyTables()}
      </div>
    );
  }

  renderContent() {
    return (this.props.isGettingUsersRoles || this.props.isGettingAcls || this.props.isGettingPermissions)
      ? <LoadingSpinner />
      : this.renderTables();
  }

  getEntitySetTitle() {

    if (this.props.entitySet.isEmpty()) {
      return null;
    }

    return this.props.entitySet.get('title');
  }

  render() {
    return (
      <div>
        <Page.Header>
          <Page.Title>Permissions Summary</Page.Title>
          <h3 className={styles.headerTitle}>{this.getEntitySetTitle()}</h3>
        </Page.Header>
        <Page.Body>
          {this.renderContent()}
          <div className={styles.asterix}>
            <div>
              {
                `* Default permissions are effectively public permissions.
                  They are granted to all authenticated OpenLattice users.
                  For readability, only people with permissions that are different
                  than the default are displayed in the tables above.
                  To change default permissions, go to "Manage Permissions"
                  on the entity set detail view.`
              }
            </div>
          </div>
        </Page.Body>
      </div>
    );
  }
}

// TODO: Move EntitySet calculations to helper functions/epics & reuse in EntitySetDetailComponent
function mapStateToProps(state, ownProps) {

  const entitySetId = ownProps.params.id;
  const permissionsSummary = state.get('permissionsSummary');

  const authenticatedUserPermissions = permissionsSummary.get('authenticatedUserPermissions');

  return {
    entitySet: state.getIn(['edm', 'entitySets', entitySetId], Immutable.Map()),
    entityUserPermissions: permissionsSummary.get('entityUserPermissions'),
    entityRolePermissions: permissionsSummary.get('entityRolePermissions'),
    propertyPermissions: permissionsSummary.get('propertyPermissions'),
    isGettingUsersRoles: permissionsSummary.get('isGettingUsersRoles'),
    isGettingAcls: permissionsSummary.get('isGettingAcls'),
    isGettingPermissions: permissionsSummary.get('isGettingPermissions')
  };
}

export function mapDispatchToProps(dispatch) {

  const actions = {
    getAllUsersAndRolesRequest: psActionFactory.getAllUsersAndRolesRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
