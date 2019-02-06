import React from 'react';

import Immutable, { fromJS } from 'immutable';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import DropdownListGroup from './DropdownListGroup';
import StyledSectionHeading from './StyledSectionHeading';

import {
  loadTrustedOrganizationsRequest,
  trustOrganizationRequest
} from '../actions/OrganizationActionFactory';

const TrustedOrgListContainer = styled.div`
  width: 400px;
`;

function mapStateToProps(state, ownProps) {

  return {
    allOrganizations: state.getIn(['organizations', 'organizations']),
    trustedOrganizations: state.getIn(['organizations', 'trustedOrganizations'])
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    loadTrustedOrganizationsRequest,
    trustOrganizationRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationTrustedOrgsSectionComponent extends React.Component {

  static propTypes = {
    actions: PropTypes.shape({
      loadTrustedOrganizationsRequest: PropTypes.func.isRequired,
      trustOrganizationRequest: PropTypes.func.isRequired
    }).isRequired,
    organization: PropTypes.instanceOf(Immutable.Map).isRequired,
    allOrganizations: PropTypes.instanceOf(Immutable.Map).isRequired,
    trustedOrganizations: PropTypes.instanceOf(Immutable.List).isRequired
  }

  removeTrustedOrg = (principal) => {
    const { actions, organization, allOrganizations } = this.props;

    actions.trustOrganizationRequest(organization.get('id'), principal, false);  }

  addTrustedOrg = (principal) => {
    const { actions, organization, allOrganizations } = this.props;

    actions.trustOrganizationRequest(organization.get('id'), principal, true);  }

  getTrustedOrganizationItems = () => {
    const { trustedOrganizations, allOrganizations } = this.props;
    return trustedOrganizations
      .map((organizationId) => allOrganizations.get(organizationId))
      .filter(org => !!org)
      .map(org => fromJS({
        principal: org.get('principal'),
        value: org.get('title')
      }));
  }

  getOrganizationOptions = () => {
    const { organization, allOrganizations, trustedOrganizations } = this.props;

    return allOrganizations.valueSeq().filter((org) => {
      const id = org.get('id');
      return id !== organization.get('id') && !trustedOrganizations.includes(id);
    }).map((org) => ({
      label: org.get('title'),
      value: org.getIn(['principal', 'id'])
    })).toJS();
  }

  render() {

    const isOwner = this.props.organization.get('isOwner', false);

    let sectionContent;
    if (this.props.allOrganizations.isEmpty() && !isOwner) {
      sectionContent = (
        <span>No trusted organizations.</span>
      );
    }
    else {
      sectionContent = (
        <TrustedOrgListContainer>
          <DropdownListGroup
              placeholder="Add new trusted organization..."
              items={this.getTrustedOrganizationItems()}
              viewOnly={!isOwner}
              options={this.getOrganizationOptions()}
              onAdd={this.addTrustedOrg}
              onRemove={this.removeTrustedOrg} />
        </TrustedOrgListContainer>
      );
    }

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Trusted Organizations</h3>
          <h5>Organizations listed here and all their members will be able to see this organization and all its roles.</h5>
        </StyledSectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationTrustedOrgsSectionComponent);
