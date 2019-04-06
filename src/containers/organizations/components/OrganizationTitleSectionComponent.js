import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Button, Modal, SplitButton, MenuItem } from 'react-bootstrap';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Models,
  Types
} from 'lattice';

import PermissionsPanel from '../../permissionspanel/PermissionsPanel';
import InlineEditableControl from '../../../components/controls/InlineEditableControl';
import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';

import { isNonEmptyString } from '../../../utils/LangUtils';
import { AUTHENTICATED_USER } from '../../../utils/Consts/UserRoleConsts';

import {
  getAclRequest,
  updateAclRequest
} from '../../permissions/PermissionsActionFactory';

import {
  createOrganizationRequest,
  updateOrganizationTitleRequest
} from '../actions/OrganizationActionFactory';

const {
  Acl,
  AclBuilder,
  AclData,
  AclDataBuilder,
  Ace,
  AceBuilder,
  OrganizationBuilder,
  PrincipalBuilder
} = Models;

const {
  ActionTypes,
  PermissionTypes,
  PrincipalTypes
} = Types;

const TitleSectionContainer = styled(StyledFlexContainer)`
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const VisibilityToggle = styled.div`
  border: 1px solid #ffffff;
  margin-left: 10px;
  text-align: right;
  padding: 4px 8px;
  position: relative;
  color: ${(props) => {
    return props.isPublic ? '#39de9d' : '#e91e63';
  }};
  &:hover {
    border: 1px solid #cfd8dc;
    cursor: ${(props) => {
      return props.isOwner ? 'pointer' : 'default';
    }};
  }
`;

const VisibilityToggleText = styled.span`
  margin-right: 20px;
`;

const VisibilityToggleIcon = styled.span`
  position: absolute;
  right: 8px;
`;

const ManagePermissionsButtonContainer = styled.div`
  margin-left: 10px;
  padding: 4px 8px 10px 8px;
  position: relative;
  display: block;
`;

const PermissionButtons = styled.div`
  display: flex;
  flex-direction: column;
  min-width: fit-content;
  align-items: flex-end;
`;

function mapDispatchToProps(dispatch) {

  const actions = {
    createOrganizationRequest,
    updateOrganizationTitleRequest,
    updateAclRequest,
    getAclRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationTitleSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      createOrganizationRequest: React.PropTypes.func.isRequired,
      updateOrganizationTitleRequest: React.PropTypes.func.isRequired,
      getAclRequest: React.PropTypes.func.isRequired,
      updateAclRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    ownedRoles: React.PropTypes.instanceOf(Immutable.Set).isRequired
  }

  constructor(props) {
    super(props);

    const { organization } = this.props;

    let modalAclKey = [];
    const orgId = organization.get('id');
    if (orgId) {
      modalAclKey = [orgId];
    }

    let modalTitle = '';
    const orgTitle = organization.get('title');
    if (orgTitle) {
      modalTitle = this.getPermissionModalTitle(orgTitle, false);
    }

    this.state = {
      editingPermissions: false,
      permissionsModalTitle: modalTitle,
      permissionsModalAclKey: modalAclKey,
      permissionsShouldUpdateAll: false
    };
  }

  updateOrganizationTitle = (title) => {

    const orgId = this.props.organization.get('id');
    const orgBuilder = new OrganizationBuilder();

    const principal = (new PrincipalBuilder())
      .setType(PrincipalTypes.ORGANIZATION)
      .setId(title.replace(/\W/g, ''))
      .build();

    if (!isNonEmptyString(orgId)) {

      const org = orgBuilder
        .setTitle(title)
        .setPrincipal(principal)
        .build();
      this.props.actions.createOrganizationRequest(org);
    }
    else {
      const org = orgBuilder
        .setId(orgId)
        .setTitle(title)
        .setPrincipal(principal)
        .build();
      this.props.actions.updateOrganizationTitleRequest(org);
    }
  }

  togglePublicVisibility = () => {

    const principal = (new PrincipalBuilder())
      .setType(PrincipalTypes.ROLE)
      .setId(AUTHENTICATED_USER)
      .build();

    const ace :Ace = (new AceBuilder())
      .setPermissions([PermissionTypes.READ])
      .setPrincipal(principal)
      .build();

    const acl :Acl = (new AclBuilder())
      .setAclKey([this.props.organization.get('id')])
      .setAces([ace])
      .build();

    const isPublic = this.props.organization.get('isPublic', false);
    const aclData :AclData = (new AclDataBuilder())
      .setAction(isPublic ? ActionTypes.REMOVE : ActionTypes.SET)
      .setAcl(acl)
      .build();

    this.props.actions.updateAclRequest(aclData);
  }

  renderVisibilityToggle = () => {

    const orgId = this.props.organization.get('id');
    const isOwner = this.props.organization.get('isOwner', false);
    const isPublic = this.props.organization.get('isPublic', false);

    const publicListingText = `ORGANIZATION ${isPublic ? '' : 'NOT '}LISTED PUBLICLY`;

    if (!isOwner || !isNonEmptyString(orgId)) {
      return null;
    }

    return (
      <VisibilityToggle isOwner={isOwner} isPublic={isPublic} onClick={this.togglePublicVisibility}>
        <VisibilityToggleText>{publicListingText}</VisibilityToggleText>
        <VisibilityToggleIcon>
          {
            isPublic
              ? <FontAwesome name="check" />
              : <FontAwesome name="times" />
          }
        </VisibilityToggleIcon>
      </VisibilityToggle>
    );
  }

  getPermissionModalTitle = (title, shouldUpdateRoles) => {
    return (shouldUpdateRoles) ? `${title} (organization and all owned roles)` : `${title} (organization only)`;
  }

  updateModalView = (newViewTitle, newViewAclKey, shouldUpdateAll) => {
    this.setState({
      permissionsModalTitle: newViewTitle,
      permissionsModalAclKey: newViewAclKey,
      permissionsShouldUpdateAll: shouldUpdateAll
    });
  }

  getPermissionsManagementOptions = () => {
    const { organization, ownedRoles } = this.props;

    const isOwner = organization.get('isOwner', false);
    const orgTitle = organization.get('title');
    const orgId = organization.get('id');

    if (!isOwner) {
      return null;
    }

    const roleOptions = [];
    organization.get('roles').forEach((role) => {
      let aclKey = role.get('aclKey');

      if (ownedRoles.has(aclKey)) {
        aclKey = aclKey.toJS();
        const title = role.get('title');

        roleOptions.push(
          <MenuItem
              eventKey={aclKey}
              key={aclKey}
              onClick={() => {
                this.updateModalView(title, aclKey);
              }}>
            {title}
          </MenuItem>
        );
      }
    });

    const orgAllTitle = this.getPermissionModalTitle(orgTitle, true);
    const orgOnlyTitle = this.getPermissionModalTitle(orgTitle, false);

    return (
      <SplitButton bsStyle="default" title={this.state.permissionsModalTitle} id="permissions-select">
        <MenuItem header>Organization</MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(orgOnlyTitle, [orgId]);
            }}
            eventKey={orgOnlyTitle}>
          {orgOnlyTitle}
        </MenuItem>
        <MenuItem
            onClick={() => {
              this.updateModalView(orgAllTitle, [orgId], true);
            }}
            eventKey={orgAllTitle}>
          {orgAllTitle}
        </MenuItem>
        <MenuItem divider />
        <MenuItem header>Roles</MenuItem>
        {roleOptions}
      </SplitButton>
    );
  }

  renderPermissionsPanel = () => {
    const {
      organization,
      ownedRoles
    } = this.props;
    const {
      permissionsModalAclKey: aclKey,
      permissionsShouldUpdateAll
    } = this.state;

    const orgId = organization.get('id');
    const orgTitle = organization.get('title');
    const isOwner = organization.get('isOwner', false);

    if (!isOwner || !isNonEmptyString(orgId)) {
      return null;
    }

    const roleAclKeys = organization
      .get('roles')
      .map(role => role.get('aclKey'))
      .filter(aclKey => ownedRoles.has(aclKey))
      .map(aclKey => aclKey.toJS());
    const allAclKeys = roleAclKeys.push([orgId]).toJS();

    let panel = null;

    if (aclKey.length === 1) {

      const aclKeysToUpdate = [aclKey];
      if (permissionsShouldUpdateAll) {
        roleAclKeys.forEach((roleAclKey) => {
          aclKeysToUpdate.push(roleAclKey);
        });
      }
      panel = (
        <PermissionsPanel
            entitySetId={aclKey[0]}
            aclKeysToUpdate={aclKeysToUpdate}
            allSelected={permissionsShouldUpdateAll}
            isOrganization />
      );
    }
    else if (aclKey.length === 2) {
      panel = (
        <PermissionsPanel
            entitySetId={aclKey[0]}
            propertyTypeId={aclKey[1]}
            aclKeysToUpdate={[aclKey]}
            isOrganization />
      );
    }

    return (
      <Modal
          show={this.state.editingPermissions}
          onHide={() => {
            this.setState({ editingPermissions: false });
          }}>
        <Modal.Header closeButton>
          <Modal.Title>Manage permissions for {this.getPermissionsManagementOptions()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {panel}
        </Modal.Body>
      </Modal>
    );
  };

  renderPermissions = () => {

    const orgId = this.props.organization.get('id');
    const isOwner = this.props.organization.get('isOwner', false);

    if (!isOwner || !isNonEmptyString(orgId)) {
      return null;
    }

    return (
      <ManagePermissionsButtonContainer>
        <Button
            bsStyle="info"
            onClick={() => {
              this.setState({ editingPermissions: true });
            }}>
          Manage Permissions
        </Button>
      </ManagePermissionsButtonContainer>
    );
  }

  render() {

    const isOwner = this.props.organization.get('isOwner', false);

    return (
      <TitleSectionContainer>
        <InlineEditableControl
            type="text"
            size="xlarge"
            placeholder="Organization title..."
            value={this.props.organization.get('title')}
            viewOnly={!isOwner}
            onChange={this.updateOrganizationTitle} />
        <PermissionButtons>
          { this.renderPermissions() }
          { this.renderVisibilityToggle() }
        </PermissionButtons>
        { this.renderPermissionsPanel() }
      </TitleSectionContainer>
    );
  }
}

export default connect(null, mapDispatchToProps)(OrganizationTitleSectionComponent);
