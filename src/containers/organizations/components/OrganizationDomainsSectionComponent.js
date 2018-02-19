import React from 'react';

import Immutable from 'immutable';
import PropTypes from 'prop-types';
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

let idCounter = 0;
function getUniqueId() :string {

  idCounter += 1;
  return `${idCounter}`;
}

function mapStateToProps(state, ownProps) {

  const emailDomainItems = Immutable.OrderedMap().withMutations((map) => {
    ownProps.organization.get('emails', Immutable.List()).forEach((email) => {
      const id = getUniqueId();
      const item = Immutable.fromJS({
        id,
        value: email
      });
      map.set(id, item);
    });
  });

  return {
    emailDomainItems
  };
}

function mapDispatchToProps(dispatch) {

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
    actions: PropTypes.shape({
      addDomainToOrganizationRequest: PropTypes.func.isRequired,
      removeDomainFromOrganizationRequest: PropTypes.func.isRequired
    }).isRequired,
    emailDomainItems: PropTypes.instanceOf(Immutable.Map).isRequired,
    organization: PropTypes.instanceOf(Immutable.Map).isRequired
  }


  addDomain = (domain) => {

    this.props.actions.addDomainToOrganizationRequest(this.props.organization.get('id'), domain);
  }

  removeDomain = (emailDomainId) => {

    const emailDomain = this.props.emailDomainItems.get(emailDomainId).get('value');
    this.props.actions.removeDomainFromOrganizationRequest(this.props.organization.get('id'), emailDomain);
  }

  isValidDomain = (domain) => {

    return Utils.isValidEmail(`test@${domain}`);
  }

  render() {

    const isOwner = this.props.organization.get('isOwner', false);

    let sectionContent;
    if (this.props.emailDomainItems.isEmpty() && !isOwner) {
      sectionContent = (
        <span>No domains.</span>
      );
    }
    else {
      sectionContent = (
        <DomainsListContainer>
          <SimpleListGroup
              placeholder="Add new domain..."
              items={this.props.emailDomainItems.toList()} // toList() or valueSeq() ...?
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
