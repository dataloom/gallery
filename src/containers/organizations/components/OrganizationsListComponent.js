/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import Button from '../../../components/buttons/Button';
import OverviewCard from '../../../components/cards/OverviewCard';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import { fetchOrganizationsRequest } from '../actions/OrganizationsActionFactory';

const OrgOverviewCardCollection = styled(StyledFlexContainerStacked)`
  margin-bottom: 25px;
`;

function mapStateToProps(state :Immutable.Map) {

  const isFetchingOrgs :boolean = state.getIn(['organizations', 'isFetchingOrgs']);
  const isSearchingOrgs :boolean = state.getIn(['organizations', 'isSearchingOrgs']);

  const organizations :Immutable.Map = state.getIn(['organizations', 'organizations'], Immutable.Map());
  const visibleOrganizationIds :Immutable.Set = state.getIn(
    ['organizations', 'visibleOrganizationIds'],
    Immutable.Set()
  );

  return {
    isFetchingOrgs,
    isSearchingOrgs,
    organizations,
    visibleOrganizationIds
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrganizationsRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationsListComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrganizationsRequest: React.PropTypes.func.isRequired
    }).isRequired,
    isFetchingOrgs: React.PropTypes.bool.isRequired,
    isSearchingOrgs: React.PropTypes.bool.isRequired,
    organizations: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    visibleOrganizationIds: React.PropTypes.instanceOf(Immutable.Set).isRequired
  };

  componentDidMount() {

    this.props.actions.fetchOrganizationsRequest();
  }

  renderOrganization = (organization :Immutable.Map) => {

    const viewOrgDetailsOnClick = () => {
      hashHistory.push(`/orgs/${organization.get('id')}`);
    };

    const viewOrgDetailsButton = (
      <Button onClick={viewOrgDetailsOnClick}>
        View Organization
      </Button>
    );

    return (
      <OverviewCard
          key={organization.get('id')}
          title={organization.get('title')}
          description={organization.get('description')}
          actionControl={viewOrgDetailsButton} />
    );
  }

  renderOrganizations = () => {

    const yourOrgs = [];
    const otherOrgs = [];

    this.props.visibleOrganizationIds.forEach((orgId :UUID) => {

      const organization :Immutable.Map = this.props.organizations.get(orgId, Immutable.Map());
      if (!organization.isEmpty()) {
        if (organization.get('isOwner') === true) {
          yourOrgs.push(this.renderOrganization(organization));
        }
        else {
          otherOrgs.push(this.renderOrganization(organization));
        }
      }
    });

    if (yourOrgs.length === 0 && otherOrgs.length === 0) {
      return this.renderNoOrganizations();
    }

    // TODO: this can be refactored

    let yourOrgsOverviewCardCollection = null;
    if (yourOrgs.length > 0) {
      yourOrgsOverviewCardCollection = (
        <OrgOverviewCardCollection>
          <h2>Your Organizations</h2>
          { yourOrgs }
        </OrgOverviewCardCollection>
      );
    }

    let otherOrgsOverviewCardCollection = null;
    if (otherOrgs.length > 0) {
      otherOrgsOverviewCardCollection = (
        <OrgOverviewCardCollection>
          <h2>Other Organizations</h2>
          { otherOrgs }
        </OrgOverviewCardCollection>
      );
    }

    return (
      <StyledFlexContainerStacked>
        { yourOrgsOverviewCardCollection }
        { otherOrgsOverviewCardCollection }
      </StyledFlexContainerStacked>
    );
  }

  renderNoOrganizations = () => {

    // TODO: need a better view when there's no organizations to show

    return (
      <div>No organizations found.</div>
    );
  }

  render() {

    // TODO: async content loading

    if (this.props.isFetchingOrgs || this.props.isSearchingOrgs) {
      return <LoadingSpinner />;
    }

    return this.renderOrganizations();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsListComponent);
