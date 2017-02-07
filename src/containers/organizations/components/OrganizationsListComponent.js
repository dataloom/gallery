/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { bindActionCreators } from 'redux';

import Button from '../../../components/buttons/Button';
import OverviewCard from '../../../components/cards/OverviewCard';
import OverviewCardCollection from '../../../components/cards/OverviewCardCollection';

import { fetchOrgsRequest } from '../actions/OrganizationsActionFactory';
import { fetchAllUsersRequest } from '../actions/UsersActionFactory';

function mapStateToProps(state :Immutable.Map<*, *>) {

  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());

  return {
    organizations
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrgsRequest,
    fetchAllUsersRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}


class OrganizationsListComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrgsRequest: React.PropTypes.func.isRequired,
      fetchAllUsersRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organizations: React.PropTypes.instanceOf(Immutable.Map).isRequired
  };

  componentDidMount() {

    this.props.actions.fetchOrgsRequest();
    this.props.actions.fetchAllUsersRequest();
  }

  renderOrganization = (organization :Immutable.Map) => {

    const viewOrgDetailsOnClick = () => {
      hashHistory.push(`/org/${organization.get('id')}`);
    };

    const viewOrgDetailsButton = (
      <Button onClick={viewOrgDetailsOnClick}>
        View Organization Details
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

    if (this.props.organizations.isEmpty()) {
      return this.renderNoOrganizations();
    }

    return this.renderOrganizations();
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsListComponent);
