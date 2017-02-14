/*
 * @flow
 */

import React from 'react';

import FontAwesome from 'react-fontawesome';
import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import Button from '../../../components/buttons/Button';
import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import {
  searchOrgsRequest
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

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    searchOrgsRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };

}

class OrganizationsHeaderComponent extends React.Component {

  state :{
    searchInputValue :string
  }

  static propTypes = {
    actions: React.PropTypes.shape({
      searchOrgsRequest: React.PropTypes.func.isRequired
    }).isRequired
  };

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

    this.props.actions.searchOrgsRequest(searchQuery);
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

  renderSearch = () => {

    return (
      <SearchBox>
        <SearchIcon><FontAwesome name="search" /></SearchIcon>
        <SearchInput
            type="text"
            placeholder="Search for an Organization"
            value={this.state.searchInputValue}
            onChange={this.handleOnChangeSearchInput}
            onKeyDown={this.handleOnKeyDownSearchInput} />
        <Button onClick={this.handleOnClickSearchButton}>
          Search
        </Button>
      </SearchBox>
    );
  }

  render() {

    return (
      <StyledFlexContainerStacked>
        <h1>Organizations</h1>
        <Actions>
          { this.renderSearch() }
          <ActionSeparator>OR</ActionSeparator>
          <Button onClick={this.onCreateNewOrganization}>Create New Organization</Button>
        </Actions>
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsHeaderComponent);
