import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';

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
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      editingPermissions: false
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

    if (!isOwner || !isNonEmptyString(orgId)) {
      return null;
    }

    return (
      <VisibilityToggle isOwner={isOwner} isPublic={isPublic} onClick={this.togglePublicVisibility}>
        <VisibilityToggleText>PUBLIC</VisibilityToggleText>
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

  renderPermissionsPanel = () => {

    const orgId = this.props.organization.get('id');
    const orgTitle = this.props.organization.get('title');
    const isOwner = this.props.organization.get('isOwner', false);

    if (!isOwner || !isNonEmptyString(orgId)) {
      return null;
    }

    const roleAclKeys = this.props.organization.get('roles').map(role => role.get('aclKey'));
    const allAclKeys = roleAclKeys.push([orgId]).toJS();

    return (
      <Modal
          show={this.state.editingPermissions}
          onHide={() => {
            this.setState({ editingPermissions: false });
          }}>
        <Modal.Header closeButton>
          <Modal.Title>Manage permissions for organization: {orgTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PermissionsPanel entitySetId={orgId} aclKeysToUpdate={allAclKeys} isOrganization />
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
