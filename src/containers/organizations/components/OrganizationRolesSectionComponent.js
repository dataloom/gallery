/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Models, Types } from 'lattice';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import SimpleListGroup from './SimpleListGroup';
import StyledSectionHeading from './StyledSectionHeading';

import {
  addRoleToOrganizationRequest,
  removeRoleFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

const {
  Principal,
  PrincipalBuilder,
  Role,
  RoleBuilder
} = Models;

const {
  PrincipalTypes
} = Types;

const RolesListContainer = styled.div`
  width: 400px;
`;

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  const roleItems :List<Map<string, string>> = ownProps.organization
    .get('roles', Immutable.List())
    .map((role :Map<string, any>) => {
      return Immutable.fromJS({
        id: role.get('id'),
        value: role.get('title'),
        principal: role.get('principal')
      });
    });

  return {
    roleItems
  };
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
    actions: PropTypes.shape({
      addRoleToOrganizationRequest: PropTypes.func.isRequired,
      removeRoleFromOrganizationRequest: PropTypes.func.isRequired
    }).isRequired,
    organization: PropTypes.instanceOf(Immutable.Map).isRequired,
    roleItems: PropTypes.instanceOf(Immutable.List).isRequired
  }

  addRole = (roleTitle :string) => {

    const principal :Principal = (new PrincipalBuilder())
      .setType(PrincipalTypes.ROLE)
      .setId(roleTitle.replace(/\W/g, ''))
      .build();

    const role :Role = (new RoleBuilder())
      .setOrganizationId(this.props.organization.get('id'))
      .setTitle(roleTitle)
      .setPrincipal(principal)
      .build();

    this.props.actions.addRoleToOrganizationRequest(role);
  }

  removeRole = (roleId :UUID) => {

    this.props.actions.removeRoleFromOrganizationRequest(this.props.organization.get('id'), roleId);
  }

  isValidRole = (role :string) => {

    return !!role;
  }

  render() {

    const isOwner :boolean = this.props.organization.get('isOwner', false);

    let sectionContent;
    if (this.props.roleItems.isEmpty() && !isOwner) {
      sectionContent = (
        <span>No roles.</span>
      );
    }
    else {
      sectionContent = (
        <RolesListContainer>
          <SimpleListGroup
              placeholder="Add new role..."
              items={this.props.roleItems}
              isValid={this.isValidRole}
              viewOnly={!isOwner}
              onAdd={this.addRole}
              onRemove={this.removeRole} />
        </RolesListContainer>
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
