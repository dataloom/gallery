/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import SimpleListGroupControl from '../../../components/controls/SimpleListGroupControl';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import StyledSectionHeading from './StyledSectionHeading';

import {
  addRoleToOrganizationRequest,
  removeRoleFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

const ListGroupWrapper = styled.div`
  width: 500px;
`;

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    addRoleToOrganizationRequest,
    removeRoleFromOrganizationRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationRolesSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      addRoleToOrganizationRequest: React.PropTypes.func.isRequired,
      removeRoleFromOrganizationRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  addRole = (role :string) => {

    this.props.actions.addRoleToOrganizationRequest(this.props.organization.get('id'), role);
  }

  removeRole = (role :string) => {

    this.props.actions.removeRoleFromOrganizationRequest(this.props.organization.get('id'), role);
  }

  isValidRole = (role :string) => {

    return !!role;
  }

  render() {

    const isOwner :boolean = this.props.organization.get('isOwner', false);
    const roles :Immutable.List = this.props.organization.get('roles', Immutable.List()).map((role :Immutable.Map) => {
      return role.get('id');
    });

    let sectionContent;
    if (roles.isEmpty() && !isOwner) {
      sectionContent = (
        <span>No roles.</span>
      );
    }
    else {
      sectionContent = (
        <ListGroupWrapper>
          <SimpleListGroupControl
              placeholder="Add new role..."
              values={roles}
              isValid={this.isValidRole}
              viewOnly={!isOwner}
              onAdd={this.addRole}
              onRemove={this.removeRole} />
        </ListGroupWrapper>
      );
    }

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Roles</h3>
          <h5>You will be able to use the Roles below to manage permissions on Entity Sets that you own.</h5>
        </StyledSectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationRolesSectionComponent);
