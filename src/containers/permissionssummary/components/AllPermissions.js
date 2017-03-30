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
    entityUserPermissions: PropTypes.array.isRequired,
    entityRolePermissions: PropTypes.object.isRequired,
    propertyPermissions: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      // entityUserPermissions: [],
      // entityRolePermissions: {},
      // propertyPermissions: {}
    };
  }

  componentDidMount() {
    // TODO:  check that i need to set id here - is it not already in state via loadentitysetepic
    const id = this.props.params.id;
    this.props.loadEntitySet(id);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entitySet === undefined && nextProps.entitySet !== undefined) {
      this.props.initialLoad(nextProps.entitySet);
    }
  }

  renderPropertyTables() {
    const { propertyPermissions } = this.props;
    console.log('inside renderPropertyTables, propertyPermissions:', propertyPermissions);
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
          <h3>Entity Permissions</h3>
          <RolePermissionsTable
              rolePermissions={this.props.entityRolePermissions}
              headers={R_HEADERS} />
          <UserPermissionsTable
              userPermissions={this.props.entityUserPermissions}
              rolePermissions={this.props.entityRolePermissions}
              headers={U_HEADERS} />
          {this.renderPropertyTables()}
        </Page.Body>
      </Page>
    );
  }
}

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
    allUsersById: permissionsSummary.get('allUsersById').toJS(),
    properties: permissionsSummary.get('properties').toJS(),
    userAcls: permissionsSummary.get('userAcls').toJS(),
    roleAcls: permissionsSummary.get('roleAcls').toJS(),
    globalValue: permissionsSummary.get('globalValue').toJS(),
    entityUserPermissions: permissionsSummary.get('entityUserPermissions').toJS(),
    entityRolePermissions: permissionsSummary.get('entityRolePermissions').toJS(),
    propertyPermissions: permissionsSummary.get('propertyPermissions').toJS(),
    entitySet
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    setEntitySetId: (id) => {
      dispatch(psActionFactory.setEntitySetId(id));
    },
    initialLoad: (id) => {
      dispatch(psActionFactory.initialLoad(id));
    },
    loadEntitySet: (id) => {
      dispatch(actionFactories.entitySetDetailRequest(id));
      dispatch(PermissionsActionFactory.getEntitySetsAuthorizations([id]));
      // TODO: Move filter creation in helper function in EdmApi
      dispatch(edmActionFactories.filteredEdmRequest(
        [{
          type: 'EntitySet',
          id,
          include: ['EntitySet', 'EntityType', 'PropertyTypeInEntitySet']
        }]
      ));
    },
    setEntitySet: (entitySet) => {
      dispatch(psActionFactory.setEntitySet(entitySet));
    },
    setAllPermissions: (entitySetId, property) => {
      dispatch(psActionFactory.setAllPermissions(entitySetId, property));
    },
    loadAclsRequest: (entitySetId, property) => {
      dispatch(psActionFactory.loadAclsRequest(entitySetId, property));
    },
    setEntityUserPermissions: (permissions) => {
      dispatch(psActionFactory.setEntityUserPermissions(permissions));
    },
    setEntityRolePermissions: (permissions) => {
      dispatch(psActionFactory.setEntityRolePermissions(permissions));
    },
    setPropertyUserPermissions: (permissions, property) => {
      dispatch(psActionFactory.setPropertyUserPermissions(permissions, property));
    },
    setPropertyRolePermissions: (permissions, property) => {
      dispatch(psActionFactory.setPropertyRolePermissions(permissions, property));
    },
    getAllUsersAndRoles: () => {
      dispatch(psActionFactory.getAllUsersAndRoles());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AllPermissions);
