/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import StyledFlexContainerStackedLeftAligned from '../../../components/flex/StyledFlexContainerStackedLeftAligned';

import OrganizationDescriptionSectionComponent from './OrganizationDescriptionSectionComponent';
import OrganizationDomainsSectionComponent from './OrganizationDomainsSectionComponent';
import OrganizationRolesSectionComponent from './OrganizationRolesSectionComponent';
import OrganizationTitleSectionComponent from './OrganizationTitleSectionComponent';

import { isDefined, isNonEmptyString } from '../../../utils/LangUtils';

import {
  fetchOrganizationRequest
} from '../actions/OrganizationsActionFactory';

const MODES = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  // TODO: checking if orgId === 'new' feels wrong. there's probably a better pattern for this use case.
  if (isDefined(ownProps.params) && ownProps.params.orgId === 'new') {
    return {
      isFetchingOrg: false,
      mode: MODES.CREATE,
      organization: Immutable.fromJS({
        isOwner: true
      }),
      organizationId: ''
    };
  }

  let mode = MODES.VIEW;
  let organizationId;

  if (isDefined(ownProps.params) && isNonEmptyString(ownProps.params.orgId)) {
    organizationId = ownProps.params.orgId;
  }

  const isFetchingOrg = state.getIn(['organizations', 'isFetchingOrg']);
  const organization = state.getIn(['organizations', 'organizations', organizationId], Immutable.Map());
  if (organization.get('isOwner') === true) {
    mode = MODES.EDIT;
  }

  return {
    isFetchingOrg,
    mode,
    organization,
    organizationId
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrganizationRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDetailsComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrganizationRequest: React.PropTypes.func.isRequired
    }).isRequired,
    isFetchingOrg: React.PropTypes.bool.isRequired,
    mode: React.PropTypes.string.isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    organizationId: React.PropTypes.string.isRequired
  }

  componentDidMount() {

    console.log('OrganizationDetailsComponent.componentDidMount()');

    if ((this.props.mode === MODES.VIEW || this.props.mode === MODES.EDIT)) {
      this.props.actions.fetchOrganizationRequest(this.props.organizationId);
    }
  }

  componentWillReceiveProps(nextProps :Object) {

    console.log('OrganizationDetailsComponent.componentWillReceiveProps()');

    if ((nextProps.mode === MODES.VIEW || nextProps.mode === MODES.EDIT)) {
      if (this.props.organizationId !== nextProps.organizationId) {
        this.props.actions.fetchOrganizationRequest(nextProps.organizationId);
      }
    }
  }

  renderOrganizationHeaderSection = () => {

    return (
      <StyledFlexContainerStackedLeftAligned>
        { this.renderOrganizationTitleSection() }
        { this.renderOrganizationDescriptionSection() }
      </StyledFlexContainerStackedLeftAligned>
    );
  }

  renderOrganizationTitleSection = () => {

    return (
      <OrganizationTitleSectionComponent organization={this.props.organization} />
    )
  }

  renderOrganizationDescriptionSection = () => {

    // hide in create mode
    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationDescriptionSectionComponent organization={this.props.organization} />
    );
  }

  renderOrganizationDomainsSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationDomainsSectionComponent organization={this.props.organization} />
    );
  }

  renderOrganizationRolesSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    return (
      <OrganizationRolesSectionComponent organization={this.props.organization} />
    );
  }

  render() {

    console.log('OrganizationDetailsComponent.render()');

    if (this.props.isFetchingOrg) {
      return <LoadingSpinner />;
    }

    return (
      <StyledFlexContainerStacked>
        { this.renderOrganizationHeaderSection() }
        { this.renderOrganizationDomainsSection() }
        { this.renderOrganizationRolesSection() }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetailsComponent);
