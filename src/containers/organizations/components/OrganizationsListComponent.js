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
import OverviewCardCollection from '../../../components/cards/OverviewCardCollection';

import { fetchOrganizationsRequest } from '../actions/OrganizationsActionFactory';

function mapStateToProps(state :Immutable.Map) {

  const isFetchingOrgs = state.getIn(['organizations', 'isFetchingOrgs']);
  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());

  return {
    isFetchingOrgs,
    organizations
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
    organizations: React.PropTypes.instanceOf(Immutable.Map).isRequired
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

    const orgOverviewCards = [];

    this.props.organizations.forEach((organization :Immutable.Map) => {
      orgOverviewCards.push(
        this.renderOrganization(organization)
      );
    });

    return (
      <OverviewCardCollection>
        { orgOverviewCards }
      </OverviewCardCollection>
    );
  }

  renderNoOrganizations = () => {

    // TODO: need a better view when there's no organizations to show

    return (
      <div>No Orgs</div>
    );
  }

  render() {

    // TODO: async content loading

    if (this.props.isFetchingOrgs) {
      return <LoadingSpinner />;
    }

    if (this.props.organizations.isEmpty()) {
      return this.renderNoOrganizations();
    }

    return this.renderOrganizations();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsListComponent);
