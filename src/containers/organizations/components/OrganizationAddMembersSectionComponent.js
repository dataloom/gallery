/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import {
  AddButton,
  StyledElement,
  StyledInput,
  StyledListItem
} from '../../../components/controls/StyledListGroup';

import StyledSectionHeading from './StyledSectionHeading';

import {
  addMemberToOrganizationRequest,
  removeMemberFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

import {
  searchAllUsersRequest
} from '../../principals/PrincipalsActionFactory';

const SearchContainer = styled.div`
  min-height: 150px;
  width: 500px;
`;

const SearchSpinner = styled(StyledElement)`
  padding: 0;
`;

const SearchInput = styled(StyledInput)`
  flex: 1 0 auto;
`;

const UserLabel = styled(StyledElement)`
  flex: 1 0 auto;
`;

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  const isSearchingUsers :boolean = state.getIn(['organizations', 'isSearchingUsers']);
  const usersSearchResults :Immutable.Map = state.getIn(['organizations', 'usersSearchResults'], Immutable.Map());

  return {
    isSearchingUsers,
    usersSearchResults
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    addMemberToOrganizationRequest,
    removeMemberFromOrganizationRequest,
    searchAllUsersRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationAddMembersSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      addMemberToOrganizationRequest: React.PropTypes.func.isRequired,
      removeMemberFromOrganizationRequest: React.PropTypes.func.isRequired,
      searchAllUsersRequest: React.PropTypes.func.isRequired
    }).isRequired,
    isSearchingUsers: React.PropTypes.bool.isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    usersSearchResults: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  search = (searchQuery :string) => {

    if (!searchQuery) {
      return;
    }

    this.props.actions.searchAllUsersRequest(searchQuery);
  }

  handleOnKeyDownSearchInput = (event) => {

    console.log(event.target.value)

    if (event.keyCode === 13) { // 'Enter' key code
      this.search(event.target.value);
    }
    else if (event.keyCode === 8) { // 'Backspace' key code
      if (event.target.value.length === 0 || event.target.value.length === 1) {
        // TODO: clear search results
      }
    }
  }

  renderSearchBox = () => {

    // TODO: think about refactoring into a shared styled compontent
    return (
      <StyledListItem>
        <StyledElement><FontAwesome name="search" /></StyledElement>
        <SearchInput
            type="text"
            placeholder="Search for users..."
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

  handleOnClickAddUser = (userId :string) => {

    if (!userId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.addMemberToOrganizationRequest(
      this.props.organization.get('id'),
      userId
    );
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

    this.props.usersSearchResults.forEach((user :Immutable.Map) => {

      // TODO: refactor
      const userId :string = user.get('user_id');
      const nickname :string = user.get('nickname');
      const username :string = user.get('username');
      const email :string = user.get('email');

      let label :string = nickname || username;

      if (email) {
        label = `${label} - ${email}`;
      }

      if (userId.startsWith('auth0')) {
        label = `${label} - Auth0`;
      }
      else if (userId.startsWith('facebook')) {
        label = `${label} - Facebook`;
      }
      else if (userId.startsWith('google')) {
        label = `${label} - Google`;
      }

      const userListItem = (
        <StyledListItem key={userId}>
          <UserLabel>{ label }</UserLabel>
          <AddButton
              onClick={() => {
                this.handleOnClickAddUser(userId);
              }} />
        </StyledListItem>
      );

      users.push(userListItem);
    });

    return users;
  }

  render() {

    const isOwner :boolean = this.props.organization.get('isOwner', false);

    if (!isOwner) {
      return null;
    }

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Add Members</h3>
          <h5>Search for users to add to this orgnization.</h5>
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
