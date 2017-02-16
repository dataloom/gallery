/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  DataModels
} from 'loom-data';

import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import Button from '../../../components/buttons/Button';
import InlineEditableControl from '../../../components/controls/InlineEditableControl';
import SimpleListGroupControl from '../../../components/controls/SimpleListGroupControl';
import StyledFlexContainer from '../../../components/flex/StyledFlexContainer';
import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';
import StyledFlexContainerStackedLeftAligned from '../../../components/flex/StyledFlexContainerStackedLeftAligned';
import Utils from '../../../utils/Utils';

import { isDefined, isNonEmptyString } from '../../../utils/LangUtils';

import {
  createOrganizationRequest,
  updateOrganizationDescriptionRequest,
  updateOrganizationTitleRequest,
  addDomainToOrganizationRequest,
  removeDomainFromOrganizationRequest,
  addRoleToOrganizationRequest,
  removeRoleFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

import {
  fetchOrganizationRequest
} from '../actions/OrganizationsActionFactory';

const SectionHeading = styled.div`
  margin: 50px 0 25px;
  & > h3 {
    margin: 0;
    margin-bottom: 10px;
  }
  & > h5 {
    margin: 0;
  }
`;

const ListGroupWrapper = styled.div`
  width: 500px;
`;

const {
  Organization,
  OrganizationBuilder
} = DataModels;

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
    createOrganizationRequest,
    fetchOrganizationRequest,
    updateOrganizationDescriptionRequest,
    updateOrganizationTitleRequest,
    addDomainToOrganizationRequest,
    removeDomainFromOrganizationRequest,
    addRoleToOrganizationRequest,
    removeRoleFromOrganizationRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };

}

class OrganizationDetailsComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      createOrganizationRequest: React.PropTypes.func.isRequired,
      fetchOrganizationRequest: React.PropTypes.func.isRequired,
      updateOrganizationDescriptionRequest: React.PropTypes.func.isRequired,
      updateOrganizationTitleRequest: React.PropTypes.func.isRequired,
      addDomainToOrganizationRequest: React.PropTypes.func.isRequired,
      removeDomainFromOrganizationRequest: React.PropTypes.func.isRequired,
      addRoleToOrganizationRequest: React.PropTypes.func.isRequired,
      removeRoleFromOrganizationRequest: React.PropTypes.func.isRequired
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

  updateOrganizationTitle = (title :string) => {

    const orgBuilder :OrganizationBuilder = new OrganizationBuilder();

    if (this.props.mode === MODES.CREATE) {
      const org :Organization = orgBuilder
        .setTitle(title)
        .build();
      this.props.actions.createOrganizationRequest(org);
    }
    else {
      const org :Organization = orgBuilder
        .setId(this.props.organization.get('id'))
        .setTitle(title)
        .build();
      this.props.actions.updateOrganizationTitleRequest(org);
    }
  }

  updateOrganizationDescription = (description :string) => {

    const org :Organization = (new OrganizationBuilder())
      .setId(this.props.organization.get('id'))
      .setTitle(this.props.organization.get('title'))
      .setDescription(description)
      .build();

    this.props.actions.updateOrganizationDescriptionRequest(org);
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

    const isOwner :boolean = this.props.organization.get('isOwner', false);

    return (
      <InlineEditableControl
          type="text"
          size="xlarge"
          placeholder="Organization title..."
          value={this.props.organization.get('title')}
          viewOnly={!isOwner}
          onChange={this.updateOrganizationTitle} />
    );
  }

  renderOrganizationDescriptionSection = () => {

    // hide in create mode
    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    const isOwner :boolean = this.props.organization.get('isOwner', false);
    const description :string = this.props.organization.get('description');

    // hide if there's no description and the viewer is not the owner
    if (!isNonEmptyString(description) && !isOwner) {
      return null;
    }

    return (
      <InlineEditableControl
          type="textarea"
          size="medium"
          placeholder="Organization description..."
          value={description}
          viewOnly={!isOwner}
          onChange={this.updateOrganizationDescription} />
    );
  }

  addDomain = (domain :string) => {

    this.props.actions.addDomainToOrganizationRequest(this.props.organization.get('id'), domain);
  }

  removeDomain = (domain :string) => {

    this.props.actions.removeDomainFromOrganizationRequest(this.props.organization.get('id'), domain);
  }

  isValidDomain = (domain :string) => {

    return Utils.isValidEmail(`test@${domain}`);
  }

  renderOrganizationDomainsSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    const isOwner :boolean = this.props.organization.get('isOwner', false);
    const emailDomains :Immutable.List = this.props.organization.get('emails', Immutable.List());

    let sectionContent;
    if (emailDomains.isEmpty() && !isOwner) {
      sectionContent = (
        <span>No domains.</span>
      );
    }
    else {
      sectionContent = (
        <ListGroupWrapper>
          <SimpleListGroupControl
              placeholder="Add new domain..."
              values={emailDomains}
              isValid={this.isValidDomain}
              viewOnly={!isOwner}
              onAdd={this.addDomain}
              onRemove={this.removeDomain} />
        </ListGroupWrapper>
      );
    }

    return (
      <StyledFlexContainerStacked>
        <SectionHeading>
          <h3>Domains</h3>
          <h5>Users from these domains will automatically be approved when requesting to join this organization.</h5>
        </SectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
    );
  }

  addRole = (role :string) => {

    this.props.actions.addRoleToOrganizationRequest(this.props.organization.get('id'), role);
  }

  removeRole = (role :string) => {

    this.props.actions.removeRoleFromOrganizationRequest(this.props.organization.get('id'), role);
  }

  isValidRole = (role :string) => {

    return !!role;
  }

  renderOrganizationRolesSection = () => {

    if (this.props.mode === MODES.CREATE) {
      return null;
    }

    const isOwner :boolean = this.props.organization.get('isOwner', false);
    const roles :Immutable.List = this.props.organization.get('roles', Immutable.List()).map((role :Immutable.Map) => {
      return role.get('id');
    });

    let sectionContent;
    if (roles.isEmpty() && !isOwner) {
      sectionContent = (
        <span>No roles.</span>
      );
    }
    else {
      sectionContent = (
        <ListGroupWrapper>
          <SimpleListGroupControl
              placeholder="Add new role..."
              values={roles}
              isValid={this.isValidRole}
              viewOnly={!isOwner}
              onAdd={this.addRole}
              onRemove={this.removeRole} />
        </ListGroupWrapper>
      );
    }

    return (
      <StyledFlexContainerStacked>
        <SectionHeading>
          <h3>Roles</h3>
          <h5>You will be able to use the Roles below to manage permissions on Entity Sets that you own.</h5>
        </SectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
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
