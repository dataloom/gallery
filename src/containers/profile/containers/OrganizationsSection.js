import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';

import OrganizationSectionView from '../../../components/profile/OrganizationSectionView';
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

  getSortedOrgs = () => {
    const { visibleOrganizationIds, organizations, auth } = this.props;
    const sortedOrgs = sortOrganizations(visibleOrganizationIds, organizations, auth);
    if (sortedOrgs.yourOrgs[0]) {
      console.log('sortedOrgs org:', sortedOrgs.yourOrgs[0].toJS());
    }
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
