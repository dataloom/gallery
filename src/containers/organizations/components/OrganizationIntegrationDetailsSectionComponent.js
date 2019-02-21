import React from 'react';

import Immutable, { Map } from 'immutable';
import styled from 'styled-components';
import { Models } from 'lattice';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InlineEditableControl from '../../../components/controls/InlineEditableControl';
import StyledSectionHeading from './StyledSectionHeading';
import SecureFieldView from '../../../components/profile/SecureFieldView';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { updateOrganizationNameRequest } from '../actions/OrganizationActionFactory';

const { OrganizationBuilder } = Models;

function mapStateToProps(state) {

  return {
    organizationIntegrationAccount: state.getIn(['organizations', 'organizationIntegrationAccount'], Map())
  };
}

const Header = styled.h3`
  margin-bottom: 20px !important;
`;

const AccountRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-family: 'Open Sans', sans-serif;
  margin-top: 15px;

  h1 {
    width: 70px;
    font-size: 12px;
    font-weight: 600;
    line-height: normal;
    color: #8e929b;
    text-transform: uppercase;
    margin: 0 20px 0 0;
  }
`;

class OrganizationIntegrationDetailsSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      updateOrganizationNameRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  render() {

    const { organization, organizationIntegrationAccount } = this.props;

    const isOwner = organization.get('isOwner', false);

    // hide if there's no description and the viewer is not the owner
    if (!isOwner || !organizationIntegrationAccount.size) {
      return null;
    }

    return (
      <StyledSectionHeading>
        <Header>Integration Account Details</Header>
        <AccountRow>
          <h1>JDBC URL</h1>
          <div>{`jdbc:postgresql://localhost:5432/${organization.get('id').replace(/\-/g, '')}`}</div>
        </AccountRow>
        <AccountRow>
          <h1>User</h1>
          <div>{organizationIntegrationAccount.get('user')}</div>
        </AccountRow>
        <AccountRow>
          <h1>Credential</h1>
          <SecureFieldView content={{ value: organizationIntegrationAccount.get('credential') }} />
        </AccountRow>
      </StyledSectionHeading>
    );
  }
}

export default connect(mapStateToProps, null)(OrganizationIntegrationDetailsSectionComponent);
