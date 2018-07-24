import React from 'react';

import { List, Map } from 'immutable';

import styled, {
  css
} from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Models,
  Types
} from 'lattice';

import StyledBadge from '../../../components/badges/StyledBadge';
import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import StyledSectionHeading from './StyledSectionHeading';

import * as OrgsUtils from '../utils/OrgsUtils';

import {
  RemoveButton,
  StyledElement,
  StyledListItem
} from './StyledListGroupComponents';

import {
  updateAclRequest
} from '../../permissions/PermissionsActionFactory';

import {
  fetchUsersRequest
} from '../../principals/PrincipalsActionFactory';

import {
  addRoleToMemberRequest,
  removeMemberFromOrganizationRequest,
  removeRoleFromMemberRequest
} from '../actions/OrganizationActionFactory';

const {
  AclBuilder,
  AclDataBuilder,
  AceBuilder,
  PrincipalBuilder
} = Models;

const {
  ActionTypes,
  PermissionTypes,
  PrincipalTypes
} = Types;

const MemberListContainer = styled.div`
  width: 400px;
`;

const MemberRolesContainer = styled(StyledFlexContainerStacked)`
  background-color: #ffffff;
  border: 1px solid #cfd8dc;
  margin-left: -1px;
  min-width: 120px;
  padding: 10px;
`;

const MemberListItem = styled(StyledListItem)`
  background-color: ${(props) => {
    return props.selected ? '#f5f5f5' : 'transparent';
  }};
  ${(props) => {
    if (props.isOwner) {
      return css`
        &:hover {
          background-color: #f5f5f5;
          cursor: pointer;
        }
      `;
    }
    return '';
  }}
`;

const RoleBadge = styled(StyledBadge)`
  margin: 5px auto;
  width: 100%;
  ${(props) => {
    if (props.selected) {
      return css`
        background-color: #4203c5;
        border-color: #4203c5;
        color: #ffffff;
      `;
    }
    return '';
  }}
`;

function mapStateToProps(state, ownProps) {
  const members = Map().withMutations((map) => {
    ownProps.users.forEach((member) => {
      map.set(member.get('principal', Map()).get('principal', Map()).get('id'), member);
    });
  });

  return {
    members
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    addRoleToMemberRequest,
    fetchUsersRequest,
    removeMemberFromOrganizationRequest,
    removeRoleFromMemberRequest,
    updateAclRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationMembersSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      addRoleToMemberRequest: React.PropTypes.func.isRequired,
      fetchUsersRequest: React.PropTypes.func.isRequired,
      removeMemberFromOrganizationRequest: React.PropTypes.func.isRequired,
      removeRoleFromMemberRequest: React.PropTypes.func.isRequired,
      updateAclRequest: React.PropTypes.func.isRequired
    }).isRequired,
    users: React.PropTypes.instanceOf(List).isRequired,
    members: React.PropTypes.instanceOf(Map).isRequired,
    organization: React.PropTypes.instanceOf(Map).isRequired
  }

  constructor(props) {

    super(props);

    this.state = {
      selectedMemberId: '',
      showMemberRoles: false
    };
  }

  handleOnClickRemoveMember = (userId) => {

    if (!userId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.removeMemberFromOrganizationRequest(
      this.props.organization.get('id'),
      userId
    );

    const principal = (new PrincipalBuilder())
      .setType(PrincipalTypes.USER)
      .setId(userId)
      .build();

    const ace = (new AceBuilder())
      .setPermissions([PermissionTypes.READ])
      .setPrincipal(principal)
      .build();

    const acl = (new AclBuilder())
      .setAclKey([this.props.organization.get('id')])
      .setAces([ace])
      .build();

    const aclData = (new AclDataBuilder())
      .setAction(ActionTypes.REMOVE)
      .setAcl(acl)
      .build();

    this.props.actions.updateAclRequest(aclData);

    if (this.state.selectedMemberId === userId) {
      this.setState({
        selectedMemberId: '',
        showMemberRoles: false
      });
    }
  }

  handleOnClickShowMemberRoles = (userId) => {

    if (this.state.selectedMemberId === userId) {
      this.setState({
        selectedMemberId: '',
        showMemberRoles: false
      });
      return;
    }

    this.setState({
      selectedMemberId: userId,
      showMemberRoles: true
    });
  }

  renderMemberListAndRoles = () => {

    return (
      <StyledFlexContainer>
        { this.renderMemberList() }
        { this.renderMemberRoles() }
      </StyledFlexContainer>
    );
  }

  renderMemberList = () => {

    const isOwner = this.props.organization.get('isOwner', false);

    const memberList = [];
    this.props.members.forEach((member) => {

      const memberId = member.get('principal').get('principal').get('id');
      const label = OrgsUtils.getUserNameLabelValue(member);

      const memberListItem = (
        <MemberListItem
            key={memberId}
            isOwner={isOwner}
            selected={this.state.selectedMemberId === memberId}>
          <StyledElement
              onClick={() => {
                if (isOwner) {
                  this.handleOnClickShowMemberRoles(memberId);
                }
              }}>
            { label }
          </StyledElement>
          {
            isOwner && (
              <RemoveButton
                  onClick={() => {
                    this.handleOnClickRemoveMember(memberId);
                  }} />
            )
          }
        </MemberListItem>
      );

      memberList.push(memberListItem);
    });

    return (
      <MemberListContainer>
        { memberList }
      </MemberListContainer>
    );
  }

  addRoleToMember = (roleId, memberId) => {

    if (!roleId || !memberId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.addRoleToMemberRequest(this.props.organization.get('id'), roleId, memberId);
  }

  removeRoleFromMember = (roleId, memberId) => {

    if (!roleId || !memberId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.removeRoleFromMemberRequest(this.props.organization.get('id'), roleId, memberId);
  }

  renderMemberRoles = () => {

    const isOwner = this.props.organization.get('isOwner', false);

    if (!isOwner || !this.state.showMemberRoles || !this.state.selectedMemberId) {
      return null;
    }

    const orgRoles = this.props.organization.get('roles', List());
    if (orgRoles.isEmpty()) {
      // TODO: we need a better UX to handle this case
      return (
        <MemberRolesContainer>
          <span>This organization does not have any roles.</span>
        </MemberRolesContainer>
      );
    }

    const memberRoles = this.props.members.getIn(
      [this.state.selectedMemberId, 'roles'],
      List()
    ).map((role) => {
      return role.get('id');
    });

    // TODO: add "..." when role names are too long
    const memberRolesElements = orgRoles.map((role) => {
      const roleId = role.get('id');
      const memberHasRole = memberRoles.includes(roleId);
      return (
        <RoleBadge
            key={roleId}
            selected={memberHasRole}
            onClick={() => {
              if (isOwner) {
                if (memberHasRole) {
                  this.removeRoleFromMember(roleId, this.state.selectedMemberId);
                }
                else {
                  this.addRoleToMember(roleId, this.state.selectedMemberId);
                }
              }
            }}>
          { role.get('title') }
        </RoleBadge>
      );
    });

    return (
      <MemberRolesContainer>
        { memberRolesElements }
      </MemberRolesContainer>
    );
  }

  render() {

    let sectionContent = [];
    if (this.props.members.isEmpty()) {
      sectionContent = (
        <span>No members.</span>
      );
    }
    else {
      sectionContent = (
        <StyledFlexContainer>
          { this.renderMemberList() }
          { this.renderMemberRoles() }
        </StyledFlexContainer>
      );
    }

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Members</h3>
          <h5>These users are members of this organization. Click on a member to view their roles.</h5>
        </StyledSectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationMembersSectionComponent);
