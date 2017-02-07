/*
 * @flow
 */

import React from 'react';

import FontAwesome from 'react-fontawesome';
import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  Button,
  FormControl,
  FormGroup,
  InputGroup
} from 'react-bootstrap';

import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';
import StyledStackedFlexContainer from '../../../components/flex/StyledStackedFlexContainer';

const Actions = styled(StyledFlexContainer)`
  margin-top: 20px;
  align-items: center;
`;

const ActionSeparator = styled.span`
  margin: 0 20px;
`;

// TODO: extract shared form styled-components, probably not going to be using bootstrap anymore
const SearchBox = styled.div`
  input.form-control {
    border-left: none;
    padding-left: 0;
  }
`;

function mapStateToProps(state :Immutable.Map<*, *>) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  return {};
}

class OrganizationsHeaderComponent extends React.Component {

  renderSearch = () => {

    return (
      <SearchBox>
        <FormGroup>
          <InputGroup>
            <InputGroup.Addon><FontAwesome name="search" /></InputGroup.Addon>
            <FormControl type="text" placeholder="Search for an Organization" />
          </InputGroup>
        </FormGroup>
      </SearchBox>
    );
  }

  renderCreateOrganizationButton = () => {

    return (
      <Button bsStyle="primary" onClick={() => {}}>
        Create New Organization
      </Button>
    );
  }

  render() {

    return (
      <StyledStackedFlexContainer>
        <h1>Organizations</h1>
        <Actions>
          { this.renderSearch() }
          <ActionSeparator>OR</ActionSeparator>
          { this.renderCreateOrganizationButton() }
        </Actions>
      </StyledStackedFlexContainer>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsHeaderComponent);
