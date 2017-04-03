import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
    entityUserPermissions: PropTypes.array.isRequired,
    entityRolePermissions: PropTypes.object.isRequired,
    propertyPermissions: PropTypes.object.isRequired,
    loadEntitySet: PropTypes.func.isRequired,
    isGettingUsersRoles: PropTypes.bool.isRequired,
    isGettingAcls: PropTypes.bool.isRequired,
    isGettingPermissions: PropTypes.bool.isRequired
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.loadEntitySet(id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entitySet === undefined && nextProps.entitySet !== undefined) {
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

    Object.keys(propertyPermissions).forEach((property) => {
      const rolePermissions = propertyPermissions[property].rolePermissions || [];
      const userPermissions = propertyPermissions[property].userPermissions || [];
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
    return this.props.entitySet ? this.props.entitySet.title : null;
  }

  render() {
    return (
      <DocumentTitle title="All Permissions">
        <Page>
          <Page.Header>
            <Page.Title>Permissions Summary</Page.Title>
            <h3 className={styles.headerTitle}>{this.getEntitySetTitle()}</h3>
          </Page.Header>
          <Page.Body>
            {this.renderContent()}
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}

// TODO: Move EntitySet calculations to helper functions/epics & reuse in EntitySetDetailComponent
function mapStateToProps(state) {
  const entitySetDetail = state.get('entitySetDetail');
  const normalizedData = state.get('normalizedData');
  const permissionsSummary = state.get('permissionsSummary');
  let entitySet;
  const reference = entitySetDetail.get('entitySetReference');
  if (reference) {
    entitySet = getEdmObject(normalizedData.toJS(), reference.toJS());
  }

  return {
    entitySet,
    entityUserPermissions: permissionsSummary.get('entityUserPermissions').toJS(),
    entityRolePermissions: permissionsSummary.get('entityRolePermissions').toJS(),
    propertyPermissions: permissionsSummary.get('propertyPermissions').toJS(),
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
    loadEntitySet: (id) => {
      dispatch(actionFactories.entitySetDetailRequest(id));
      dispatch(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      dispatch(edmActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    },
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
