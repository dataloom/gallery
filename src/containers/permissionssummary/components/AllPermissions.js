import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { PermissionsPropType, getPermissions, DEFAULT_PERMISSIONS } from '../../permissions/PermissionsStorage';
import { getEdmObject } from '../../edm/EdmStorage';
import * as psActionFactory from '../PermissionsSummaryActionFactory';
import * as actionFactories from '../../entitysetdetail/EntitySetDetailActionFactories';
import * as edmActionFactories from '../../edm/EdmActionFactories';
import * as PermissionsActionFactory from '../../permissions/PermissionsActionFactory';
import UserPermissionsTable from './UserPermissionsTable';
import RolePermissionsTable from './RolePermissionsTable';
import Page from '../../../components/page/Page';

const U_HEADERS = ['Users', 'Roles', 'Permissions'];
const R_HEADERS = ['Roles', 'Permissions'];

class AllPermissions extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    entitySet: PropTypes.object,
    entityUserPermissions: PropTypes.array.isRequired,
    entityRolePermissions: PropTypes.object.isRequired,
    propertyPermissions: PropTypes.object.isRequired,
    loadEntitySet: PropTypes.func.isRequired,
    initialLoad: PropTypes.func.isRequired
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.loadEntitySet(id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entitySet === undefined && nextProps.entitySet !== undefined) {
      this.props.initialLoad(nextProps.entitySet);
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
      const header = <h3 key={`header-${property}`}>{property}</h3>;
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

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>All Permissions</Page.Title>
        </Page.Header>
        <Page.Body>
          {this.renderEntityTables()}
          {this.renderPropertyTables()}
        </Page.Body>
      </Page>
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
    propertyPermissions: permissionsSummary.get('propertyPermissions').toJS()
  };
}

function mapDispatchToProps(dispatch) {
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
    initialLoad: (id) => {
      dispatch(psActionFactory.initialLoad(id));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
