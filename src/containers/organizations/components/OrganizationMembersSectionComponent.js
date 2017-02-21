/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';

import styled, {
  css
} from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { DataModels } from 'loom-data';

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
  fetchUsersRequest,
  addRoleToUserRequest,
  removeRoleFromUserRequest
} from '../../principals/PrincipalsActionFactory';

import {
  removeMemberFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

const { Principal } = DataModels;

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
  background-color: ${(props :Object) => {
    return props.selected ? '#f5f5f5' : 'transparent';
  }};
  &:hover {
    background-color: #f5f5f5;
    cursor: pointer;
  }
`;

const RoleBadge = styled(StyledBadge)`
  margin: 5px auto;
  width: 100%;
  ${(props :Object) => {
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

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  const users :Immutable.List = state.getIn(['principals', 'users'], Immutable.Map());

  const members :Immutable.Map = Immutable.Map().withMutations((map :Immutable.Map) => {
    ownProps.organization.get('members', Immutable.List()).forEach((member :Immutable.Map) => {
      const memberId = member.get('id');
      const user = users.get(memberId);
      if (user) {
        map.set(memberId, user);
      }
    });
  });

  return {
    members
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchUsersRequest,
    removeMemberFromOrganizationRequest,
    addRoleToUserRequest,
    removeRoleFromUserRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationMembersSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchUsersRequest: React.PropTypes.func.isRequired,
      removeMemberFromOrganizationRequest: React.PropTypes.func.isRequired,
      addRoleToUserRequest: React.PropTypes.func.isRequired,
      removeRoleFromUserRequest: React.PropTypes.func.isRequired
    }).isRequired,
    members: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  state :{
    selectedMemberId :string,
    showMemberRoles :boolean
  }

  constructor(props :Object) {

    super(props);

    this.state = {
      selectedMemberId: '',
      showMemberRoles: false
    };
  }

  componentDidMount() {

    const memberIds :string[] = this.props.organization
      .get('members', Immutable.List())
      .map((member :Immutable.Map) => {
        return member.get('id');
      }).toJS();

    // TODO: figure out why componentDidMount() happens multiple times
    this.props.actions.fetchUsersRequest(memberIds);
  }

  handleOnClickRemoveUser = (userId :string) => {

    if (!userId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.removeMemberFromOrganizationRequest(
      this.props.organization.get('id'),
      userId
    );
  }

  handleOnClickShowMemberRoles = (userId :string) => {

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

    const isOwner :boolean = this.props.organization.get('isOwner', false);

    const memberList = [];
    this.props.members.forEach((member :Immutable.Map) => {

      const memberId :string = member.get('user_id');
      const label :string = OrgsUtils.getUserNameLabelValue(member);

      const memberListItem = (
        <MemberListItem
            key={memberId}
            selected={this.state.selectedMemberId === memberId}>
          <StyledElement
              onClick={() => {
                this.handleOnClickShowMemberRoles(memberId);
              }}>
            { label }
          </StyledElement>
          {
            isOwner && (
              <RemoveButton
                  onClick={() => {
                    this.handleOnClickRemoveUser(memberId);
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

  addRoleToMember = (memberId :string, roleId :string) => {

    if (!memberId || !roleId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.addRoleToUserRequest(memberId, roleId);
  }

  removeRoleFromMember = (memberId :string, roleId :string) => {

    if (!memberId || !roleId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.removeRoleFromUserRequest(memberId, roleId);
  }

  renderMemberRoles = () => {

    if (!this.state.showMemberRoles || !this.state.selectedMemberId) {
      return null;
    }

    const isOwner :boolean = this.props.organization.get('isOwner', false);
    const orgRolesPrincipals :Immutable.List<Principal> = this.props.organization.get('roles', Immutable.List());
    if (orgRolesPrincipals.isEmpty()) {
      // TODO: we need a better UX to handle this case
      return (
        <MemberRolesContainer>
          <span>This organization does not have any roles.</span>
        </MemberRolesContainer>
      );
    }

    const memberRoles :Immutable.List<string> = this.props.members.getIn(
      [this.state.selectedMemberId, 'roles'],
      Immutable.List()
    );

    // TODO: add "..." when role names are too long
    const memberRolesElements = orgRolesPrincipals.map((rolePrincipal :Immutable.Map<string, Principal>) => {
      const memberHasRole :boolean = memberRoles.includes(rolePrincipal.get('id'));
      return (
        <RoleBadge
            key={rolePrincipal.get('id')}
            selected={memberHasRole}
            onClick={() => {
              if (isOwner) {
                if (memberHasRole) {
                  this.removeRoleFromMember(this.state.selectedMemberId, rolePrincipal.get('id'));
                }
                else {
                  this.addRoleToMember(this.state.selectedMemberId, rolePrincipal.get('id'));
                }
              }
            }}>
          { rolePrincipal.get('id') }
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
          <h5>These users are members of this orgnization. Click on a member to view their roles.</h5>
        </StyledSectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationMembersSectionComponent);
