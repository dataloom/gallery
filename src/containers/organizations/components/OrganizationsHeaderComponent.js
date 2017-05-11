/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import Button from '../../../components/buttons/Button';
import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import StyledHeaderTitle from './StyledHeaderTitle';

import {
  searchOrganizationsRequest,
  showAllOrganizations
} from '../actions/OrganizationsActionFactory';

const Actions = styled(StyledFlexContainer)`
  align-items: center;
  margin-top: 20px;
`;

const ActionSeparator = styled.span`
  margin: 0 20px;
`;

// TODO: extract shared form styled-components, probably not going to be using bootstrap anymore
const SearchBox = styled(StyledFlexContainer)`
  display: flex;
  flex: 1 0 auto;
  button {
    margin-left: 20px;
  }
`;

const SearchIcon = styled.span`
  background-color: #ffffff;
  border: 2px solid #a3a8ab;
  border-radius: 4px;
  border-right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  text-align: center;
  padding: 6px 12px;
`;

const SearchInput = styled.input`
  background-color: #ffffff;
  border: 2px solid #a3a8ab;
  border-radius: 4px;
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  flex: 1 0 auto;
  &:focus {
    outline: 0;
  }
`;

function mapStateToProps(state :Immutable.Map) {

  const isSearchingOrgs :boolean = state.getIn(['organizations', 'isSearchingOrgs']);

  return {
    isSearchingOrgs
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    searchOrganizationsRequest,
    showAllOrganizations
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };

}

class OrganizationsHeaderComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      searchOrganizationsRequest: React.PropTypes.func.isRequired,
      showAllOrganizations: React.PropTypes.func.isRequired
    }).isRequired,
    isSearchingOrgs: React.PropTypes.bool.isRequired
  };

  state :{
    searchInputValue :string
  }

  constructor(props) {

    super(props);

    this.state = {
      searchInputValue: ''
    };
  }

  onCreateNewOrganization = () => {

    // TODO: routing paths need to go somewhere
    hashHistory.push('/orgs/new');
  }

  search = (searchQuery :string) => {

    if (!searchQuery) {
      return;
    }

    this.props.actions.searchOrganizationsRequest(searchQuery);

    // TODO: figure out how to correctly navigate to /orgs
    hashHistory.push('/orgs');
  }

  handleOnClickSearchButton = () => {

    this.search(this.state.searchInputValue);
  }

  handleOnChangeSearchInput = (event) => {

    this.setState({
      searchInputValue: event.target.value
    });
  }

  handleOnKeyDownSearchInput = (event) => {

    switch (event.keyCode) {
      case 13: // 'Enter' key code
        this.search(event.target.value);
        break;
      default:
        break;
    }
  }

  handleOnClickShowAllButton = () => {

    // TODO: too much going on here... setting state, updating redux, navigating... this needs to be improved

    this.setState({
      searchInputValue: ''
    });

    this.props.actions.showAllOrganizations();

    // TODO: figure out how to correctly navigate to /orgs
    hashHistory.push('/orgs');
  }

  renderSearch = () => {

    return (
      <SearchBox>
        <SearchIcon><FontAwesome name="search" /></SearchIcon>
        <SearchInput
            type="text"
            placeholder="Search for an Organization"
            disabled={this.props.isSearchingOrgs}
            value={this.state.searchInputValue}
            onChange={this.handleOnChangeSearchInput}
            onKeyDown={this.handleOnKeyDownSearchInput} />
        <Button scStyle="purple" disabled={this.props.isSearchingOrgs} onClick={this.handleOnClickSearchButton}>
          Search
        </Button>
        <Button scStyle="purple" onClick={this.handleOnClickShowAllButton}>
          Show All
        </Button>
      </SearchBox>
    );
  }

  render() {

    return (
      <StyledFlexContainerStacked>
        <StyledHeaderTitle>Organizations</StyledHeaderTitle>
        <Actions>
          { this.renderSearch() }
          <ActionSeparator>OR</ActionSeparator>
          <Button scStyle="purple" onClick={this.onCreateNewOrganization}>
            Create New Organization
          </Button>
        </Actions>
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsHeaderComponent);
