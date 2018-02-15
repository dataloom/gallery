import React from 'react';

import Immutable from 'immutable';
import { Models } from 'lattice';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InlineEditableControl from '../../../components/controls/InlineEditableControl';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { updateOrganizationDescriptionRequest } from '../actions/OrganizationActionFactory';

const { OrganizationBuilder } = Models;

function mapStateToProps() {

  return {};
}

function mapDispatchToProps(dispatch) {

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

  updateOrganizationDescription = (description) => {

    const org = (new OrganizationBuilder())
      .setId(this.props.organization.get('id'))
      .setTitle(this.props.organization.get('title'))
      .setPrincipal(this.props.organization.get('principal').toJS())
      .setDescription(description)
      .build();

    this.props.actions.updateOrganizationDescriptionRequest(org);
  }

  render() {

    const isOwner = this.props.organization.get('isOwner', false);
    const description = this.props.organization.get('description');

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
