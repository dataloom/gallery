/*
 * @flow
 */

import React from 'react';

import DocumentTitle from 'react-document-title';
import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import Button from '../../../components/buttons/Button';
import OverviewCard from '../../../components/cards/OverviewCard';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import { sortOrganizations } from '../utils/OrgsUtils';

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
    auth: React.PropTypes.object.isRequired,
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
      <Button scStyle="purple" onClick={viewOrgDetailsOnClick}>
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
    const { visibleOrganizationIds, organizations } = this.props;
    const sortedOrgs = sortOrganizations(visibleOrganizationIds, organizations, this.props.auth);

    Object.keys(sortedOrgs).forEach((orgType) => {
      sortedOrgs[orgType] = sortedOrgs[orgType].map((org) => {
        return this.renderOrganization(org);
      });
    });

    if (sortedOrgs.yourOrgs.length === 0
      && sortedOrgs.memberOfOrgs.length === 0
      && sortedOrgs.publicOrgs.length === 0) {
      return this.renderNoOrganizations();
    }

    // TODO: this can be refactored

    let yourOrgsOverviewCardCollection = null;
    if (sortedOrgs.yourOrgs.length > 0) {
      yourOrgsOverviewCardCollection = (
        <OrgOverviewCardCollection>
          <h2>Owner</h2>
          { sortedOrgs.yourOrgs }
        </OrgOverviewCardCollection>
      );
    }

    let memberOfOrgsOverviewCardCollection = null;
    if (sortedOrgs.memberOfOrgs.length > 0) {
      memberOfOrgsOverviewCardCollection = (
        <OrgOverviewCardCollection>
          <h2>Member</h2>
          { sortedOrgs.memberOfOrgs }
        </OrgOverviewCardCollection>
      );
    }

    let publicOrgsOverviewCardCollection = null;
    if (sortedOrgs.publicOrgs.length > 0) {
      publicOrgsOverviewCardCollection = (
        <OrgOverviewCardCollection>
          <h3>Other Organizations</h3>
          <h4>These organizations are visible to the public.</h4>
          { sortedOrgs.publicOrgs }
        </OrgOverviewCardCollection>
      );
    }

    const shouldHideDivider = ((sortedOrgs.yourOrgs.length > 0 || sortedOrgs.memberOfOrgs.length > 0) && sortedOrgs.publicOrgs.length === 0)
      || ((sortedOrgs.yourOrgs.length === 0 && sortedOrgs.memberOfOrgs.length === 0) && sortedOrgs.publicOrgs.length > 0);

    return (
      <StyledFlexContainerStacked>
        { yourOrgsOverviewCardCollection }
        { memberOfOrgsOverviewCardCollection }
        {
          shouldHideDivider ? null : <hr />
        }
        { publicOrgsOverviewCardCollection }
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

    const content = (this.props.isFetchingOrgs || this.props.isSearchingOrgs)
      ? <LoadingSpinner />
      : this.renderOrganizations();

    return (
      <DocumentTitle title="Organizations">
        { content }
      </DocumentTitle>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsListComponent);
