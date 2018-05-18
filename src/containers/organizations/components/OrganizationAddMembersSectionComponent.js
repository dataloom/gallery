import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Models,
  Types
} from 'lattice';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import * as OrgsUtils from '../utils/OrgsUtils';

import {
  AddButton,
  SearchIcon,
  StyledElement,
  StyledInput,
  StyledListItem
} from './StyledListGroupComponents';

import StyledSectionHeading from './StyledSectionHeading';

import {
  addMemberToOrganizationRequest,
  clearUserSearchResults,
  removeMemberFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

import {
  updateAclRequest
} from '../../permissions/PermissionsActionFactory';

import {
  searchAllUsersRequest
} from '../../principals/PrincipalsActionFactory';

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

const SearchContainer = styled.div`
  min-height: 150px;
  padding-bottom: 50px;
  width: 400px;
`;

const SearchSpinner = styled(StyledElement)`
  padding: 0;
  flex: 0;
`;

function mapStateToProps(state) {

  const isSearchingUsers = state.getIn(['organizations', 'isSearchingUsers']);
  const usersSearchResults = state.getIn(['organizations', 'usersSearchResults'], Immutable.Map());

  return {
    isSearchingUsers,
    usersSearchResults
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    addMemberToOrganizationRequest,
    clearUserSearchResults,
    removeMemberFromOrganizationRequest,
    searchAllUsersRequest,
    updateAclRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationAddMembersSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      addMemberToOrganizationRequest: React.PropTypes.func.isRequired,
      clearUserSearchResults: React.PropTypes.func.isRequired,
      removeMemberFromOrganizationRequest: React.PropTypes.func.isRequired,
      searchAllUsersRequest: React.PropTypes.func.isRequired,
      updateAclRequest: React.PropTypes.func.isRequired
    }).isRequired,
    isSearchingUsers: React.PropTypes.bool.isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    usersSearchResults: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  constructor(props) {

    super(props);

    this.state = {
      searchInputValue: ''
    };
  }

  search = (searchQuery) => {

    if (!searchQuery) {
      return;
    }

    this.props.actions.searchAllUsersRequest(searchQuery);
  }

  handleOnChangeSearchInput = (event) => {

    this.setState({
      searchInputValue: event.target.value
    });
  }

  handleOnKeyDownSearchInput = (event) => {

    switch (event.keyCode) {
      case 8: { // 'Backspace' key code
        this.props.actions.clearUserSearchResults();
        break;
      }
      case 13: // 'Enter' key code
        if (event.target.value.length === 0) {
          this.props.actions.clearUserSearchResults();
        }
        else {
          this.search(event.target.value);
        }
        break;
      default:
        break;
    }
  }

  renderSearchBox = () => {

    // TODO: think about refactoring into a shared styled compontent
    return (
      <StyledListItem>
        <SearchIcon />
        <StyledInput
            type="text"
            placeholder="Search users by name..."
            onKeyDown={this.handleOnKeyDownSearchInput} />
        {
          this.props.isSearchingUsers && (
            <SearchSpinner>
              <LoadingSpinner size={25} />
            </SearchSpinner>
          )
        }
      </StyledListItem>
    );
  }

  handleOnClickAddMember = (userId) => {

    if (!userId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.addMemberToOrganizationRequest(
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
      .setAction(ActionTypes.ADD)
      .setAcl(acl)
      .build();

    this.props.actions.updateAclRequest(aclData);
  }

  renderSearchResults = () => {

    if (this.props.isSearchingUsers) {
      return null;
    }

    // // TODO: only show this when a search was performed and the results are empty
    if (this.props.usersSearchResults.isEmpty()) {
      return <span>No users found.</span>;
    }

    const users = [];

    this.props.usersSearchResults.forEach((user) => {

      const userId :string = user.get('user_id');
      const label = OrgsUtils.getUserNameLabelValue(user);

      const userListItem = (
        <StyledListItem key={userId}>
          <StyledElement>{ label }</StyledElement>
          <AddButton
              onClick={() => {
                this.handleOnClickAddMember(userId);
              }} />
        </StyledListItem>
      );

      users.push(userListItem);
    });

    return users;
  }

  render() {

    const isOwner = this.props.organization.get('isOwner', false);

    if (!isOwner) {
      return null;
    }

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Add Members</h3>
          <h5>To add members to this organization, search for users in the system.</h5>
        </StyledSectionHeading>
        <SearchContainer>
          { this.renderSearchBox() }
          { this.renderSearchResults() }
        </SearchContainer>
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationAddMembersSectionComponent);
