/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { DataModels } from 'loom-data';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InlineEditableControl from '../../../components/controls/InlineEditableControl';

import { isNonEmptyString } from '../../../utils/LangUtils';
import { updateOrganizationDescriptionRequest } from '../actions/OrganizationActionFactory';

const {
  Organization,
  OrganizationBuilder
} = DataModels;

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    updateOrganizationDescriptionRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDescriptionSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      updateOrganizationDescriptionRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  updateOrganizationDescription = (description :string) => {

    const org :Organization = (new OrganizationBuilder())
      .setId(this.props.organization.get('id'))
      .setTitle(this.props.organization.get('title'))
      .setPrincipal(this.props.organization.get('principal'))
      .setDescription(description)
      .build();

    this.props.actions.updateOrganizationDescriptionRequest(org);
  }

  render() {

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
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDescriptionSectionComponent);
