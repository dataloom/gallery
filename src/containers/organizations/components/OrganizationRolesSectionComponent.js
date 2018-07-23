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
  PrincipalBuilder,
  RoleBuilder
} = Models;

const {
  PrincipalTypes
} = Types;

const RolesListContainer = styled.div`
  width: 400px;
`;

function mapStateToProps(state, ownProps) {

  const roleItems = ownProps.organization
    .get('roles', Immutable.List())
    .map((role) => {
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

function mapDispatchToProps(dispatch) {

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

  addRole = (roleTitle) => {

    const orgId = this.props.organization.get('id');
    const roleTitleClean = roleTitle.replace(/\W/g, '');
    const principalId = `${orgId}|${roleTitleClean}`;

    const principal = (new PrincipalBuilder())
      .setType(PrincipalTypes.ROLE)
      .setId(principalId)
      .build();

    const role = (new RoleBuilder())
      .setOrganizationId(orgId)
      .setTitle(roleTitle)
      .setPrincipal(principal)
      .build();

    role['@class'] = 'com.openlattice.organization.roles.Role';

    this.props.actions.addRoleToOrganizationRequest(role);
  }

  removeRole = (roleId) => {

    this.props.actions.removeRoleFromOrganizationRequest(this.props.organization.get('id'), roleId);
  }

  isValidRole = (role) => {

    return !!role;
  }

  render() {

    const isOwner = this.props.organization.get('isOwner', false);

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
