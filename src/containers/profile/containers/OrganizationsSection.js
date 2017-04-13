import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import OrganizationSectionView from '../components/OrganizationSectionView';
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

  getRoles = (org) => {
    const roles = [];
    if (org.get('isOwner')) {
      roles.push('Owner');
    }
    let orgRoles = org.get('roles').map((role) => {
      return role.get('id').slice(org.get('id').length + 1);
    });
    orgRoles = orgRoles.toJS();

    return roles.concat(orgRoles).join(', ');
  }

  getSortedOrgs = () => {
    const { visibleOrganizationIds, organizations, auth } = this.props;
    let sortedOrgs = sortOrganizations(visibleOrganizationIds, organizations, auth);
    sortedOrgs = sortedOrgs.yourOrgs.concat(sortedOrgs.memberOfOrgs);

    sortedOrgs = sortedOrgs.map((org) => {
      const id = org.get('id');
      const title = org.get('title');
      const roles = this.getRoles(org);

      return {
        id,
        title,
        roles
      };
    });

    return sortedOrgs;
  }

  render() {
    return (
      <div>
        <OrganizationSectionView header="Your Organizations" content={this.getSortedOrgs()} />
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
