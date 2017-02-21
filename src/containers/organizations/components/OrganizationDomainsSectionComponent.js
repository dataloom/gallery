/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import Utils from '../../../utils/Utils';

import SimpleListGroup from './SimpleListGroup';
import StyledSectionHeading from './StyledSectionHeading';

import {
  addDomainToOrganizationRequest,
  removeDomainFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

const DomainsListContainer = styled.div`
  width: 400px;
`;

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    addDomainToOrganizationRequest,
    removeDomainFromOrganizationRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDomainsSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      addDomainToOrganizationRequest: React.PropTypes.func.isRequired,
      removeDomainFromOrganizationRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }


  addDomain = (domain :string) => {

    this.props.actions.addDomainToOrganizationRequest(this.props.organization.get('id'), domain);
  }

  removeDomain = (domain :string) => {

    this.props.actions.removeDomainFromOrganizationRequest(this.props.organization.get('id'), domain);
  }

  isValidDomain = (domain :string) => {

    return Utils.isValidEmail(`test@${domain}`);
  }

  render() {

    const isOwner :boolean = this.props.organization.get('isOwner', false);
    const emailDomains :Immutable.List = this.props.organization.get('emails', Immutable.List());

    let sectionContent;
    if (emailDomains.isEmpty() && !isOwner) {
      sectionContent = (
        <span>No domains.</span>
      );
    }
    else {
      sectionContent = (
        <DomainsListContainer>
          <SimpleListGroup
              placeholder="Add new domain..."
              values={emailDomains}
              isValid={this.isValidDomain}
              viewOnly={!isOwner}
              onAdd={this.addDomain}
              onRemove={this.removeDomain} />
        </DomainsListContainer>
      );
    }

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Domains</h3>
          <h5>Users from these domains will automatically be approved when requesting to join this organization.</h5>
        </StyledSectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDomainsSectionComponent);
