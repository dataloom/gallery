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
  removeMemberFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

import {
  searchAllUsersRequest
} from '../../principals/PrincipalsActionFactory';

const SearchContainer = styled.div`
  min-height: 150px;
  width: 400px;
`;

const SearchSpinner = styled(StyledElement)`
  padding: 0;
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

    switch (event.keyCode) {
      case 8: { // 'Backspace' key code
        if (event.target.value.length === 0 || event.target.value.length === 1) {
          // TODO: clear search results
        }
        break;
      }
      case 13: // 'Enter' key code
        this.search(event.target.value);
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

      const userId :string = user.get('user_id');
      const label = OrgsUtils.getUserNameLabelValue(user);

      const userListItem = (
        <StyledListItem key={userId}>
          <StyledElement>{ label }</StyledElement>
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
