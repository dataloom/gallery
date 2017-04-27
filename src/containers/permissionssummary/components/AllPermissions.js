import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS } from '../../permissions/PermissionsStorage';
import { getEdmObject } from '../../edm/EdmStorage';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import DocumentTitle from 'react-document-title';
import * as psActionFactory from '../PermissionsSummaryActionFactory';
import * as actionFactories from '../../entitysetdetail/EntitySetDetailActionFactories';
import * as edmActionFactories from '../../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import UserPermissionsTable from './UserPermissionsTable';
import RolePermissionsTable from './RolePermissionsTable';
import Page from '../../../components/page/Page';
import styles from '../styles.module.css';

const U_HEADERS = ['Users', 'Roles', 'Permissions'];
const R_HEADERS = ['Roles', 'Permissions'];

class AllPermissions extends React.Component {
  static propTypes = {
    actions: React.PropTypes.shape({
      getAllUsersAndRolesRequest: React.PropTypes.func.isRequired
    }).isRequired,
    params: PropTypes.object.isRequired,
    entitySet: PropTypes.object,
    entityUserPermissions: PropTypes.instanceOf(Immutable.List).isRequired,
    entityRolePermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    propertyPermissions: PropTypes.instanceOf(Immutable.Map).isRequired,
    loadEntitySet: PropTypes.func.isRequired,
    isGettingUsersRoles: PropTypes.bool.isRequired,
    isGettingAcls: PropTypes.bool.isRequired,
    isGettingPermissions: PropTypes.bool.isRequired
  }

  componentWillReceiveProps(nextProps) {
    if (Object.keys(this.props.entitySet).length === 0 && Object.keys(nextProps.entitySet).length > 0) {
      this.props.actions.getAllUsersAndRolesRequest(nextProps.entitySet);
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
      if (propertyPermissions.hasIn([property, 'userPermissions']) && propertyPermissions.hasIn([property, 'rolePermissions'])) {
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
      }
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
    return this.props.entitySet ? this.props.entitySet.title : null;
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
            <div>* Default permissions are effectively public permissions. They are granted to all authenticated Loom users.
            For readability, only people with permissions that are different than the default are displayed in the tables above.
            To change default permissions, go to 'Manage Permissions' on the entity set detail view.</div>
          </div>
        </Page.Body>
      </div>
    );
  }
}

// TODO: Move EntitySet calculations to helper functions/epics & reuse in EntitySetDetailComponent
function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');
  const permissionsSummary = state.get('permissionsSummary');

  return {
    entitySet: entitySetDetail.get('entitySet').toJS(),
    entityUserPermissions: permissionsSummary.get('entityUserPermissions'),
    entityRolePermissions: permissionsSummary.get('entityRolePermissions'),
    propertyPermissions: permissionsSummary.get('propertyPermissions'),
    isGettingUsersRoles: permissionsSummary.get('isGettingUsersRoles'),
    isGettingAcls: permissionsSummary.get('isGettingAcls'),
    isGettingPermissions: permissionsSummary.get('isGettingPermissions')
  };
}

function mapDispatchToProps(dispatch) {
  const actions = {
    getAllUsersAndRolesRequest: psActionFactory.getAllUsersAndRolesRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
