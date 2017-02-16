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

import {
  createOrganizationRequest,
  updateOrganizationTitleRequest
} from '../actions/OrganizationActionFactory';

const {
  Organization,
  OrganizationBuilder
} = DataModels;

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    createOrganizationRequest,
    updateOrganizationTitleRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationTitleSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      createOrganizationRequest: React.PropTypes.func.isRequired,
      updateOrganizationTitleRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  updateOrganizationTitle = (title :string) => {

    const orgId :boolean = this.props.organization.get('id');
    const orgBuilder :OrganizationBuilder = new OrganizationBuilder();

    if (!isNonEmptyString(orgId)) {
      const org :Organization = orgBuilder
        .setTitle(title)
        .build();
      this.props.actions.createOrganizationRequest(org);
    }
    else {
      const org :Organization = orgBuilder
        .setId(orgId)
        .setTitle(title)
        .build();
      this.props.actions.updateOrganizationTitleRequest(org);
    }
  }

  render() {

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
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationTitleSectionComponent);
