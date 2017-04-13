import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import ProfileSection from '../../../components/profile/ProfileSection';
import { fetchOrganizationsRequest } from '../../organizations/actions/OrganizationsActionFactory';
import { sortOrganizations } from '../../organizations/utils/OrgsUtils';

class OrganizationsSection extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    fetchOrganizationsRequest: PropTypes.func.isRequired,
    visibleOrganizationIds: PropTypes.instanceOf(Immutable.Set).isRequired,
    organizations: PropTypes.instanceOf(Immutable.Map).isRequired
  }

  componentDidMount() {
    this.props.fetchOrganizationsRequest();
  }

  getContent = () => {
    const { visibleOrganizationIds, organizations, auth } = this.props;
    const sortedOrgs = sortOrganizations(visibleOrganizationIds, organizations, auth);
    if (sortedOrgs.yourOrgs[0]) {
      console.log('sortedOrgs org:', sortedOrgs.yourOrgs[0].toJS());
    }
    const yourOrgs = sortedOrgs.yourOrgs.map((org) => {
      return (
        <div>
          {org.get('title')} (Owner)
        </div>
      );
    });

    const memberOfOrgs = sortedOrgs.memberOfOrgs.map((org) => {
      return (
          <div>
            {org.get('title')}
          </div>
      );
    });

    return yourOrgs.concat(memberOfOrgs);
  }

  render() {
    return (
      <div>
        <ProfileSection header="Your Organizations" content={this.getContent()} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const organizations = state.getIn(['organizations', 'organizations'], Immutable.Map());
  const visibleOrganizationIds = state.getIn(
    ['organizations', 'visibleOrganizationIds'],
    Immutable.Set()
  );

  return {
    organizations,
    visibleOrganizationIds
  };
}

function mapDispatchToProps(dispatch) {

  const actions = {
    fetchOrganizationsRequest
  };

  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationsSection);
