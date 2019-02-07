import React from 'react';

import Immutable from 'immutable';
import { Models } from 'lattice';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import InlineEditableControl from '../../../components/controls/InlineEditableControl';
import StyledSectionHeading from './StyledSectionHeading';
import { isNonEmptyString } from '../../../utils/LangUtils';
import { updateOrganizationNameRequest } from '../actions/OrganizationActionFactory';

const { OrganizationBuilder } = Models;

function mapStateToProps() {

  return {};
}

function mapDispatchToProps(dispatch) {

  const actions = {
    updateOrganizationNameRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationNameSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      updateOrganizationNameRequest: React.PropTypes.func.isRequired
    }).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  updateOrganizationName = (name) => {

    const org = (new OrganizationBuilder())
      .setId(this.props.organization.get('id'))
      .setTitle(this.props.organization.get('title'))
      .setPrincipal(this.props.organization.get('principal').toJS())
      .setName(name)
      .build();

    this.props.actions.updateOrganizationNameRequest(org);
  }

  render() {

    const isOwner = this.props.organization.get('isOwner', false);
    const name = this.props.organization.getIn(['principal', 'id']);

    // hide if there's no description and the viewer is not the owner
    if (!isOwner) {
      return null;
    }

    return (
      <StyledSectionHeading>
        <h3>Name</h3>
        <InlineEditableControl
            type="textarea"
            size="medium"
            placeholder="Organization name..."
            value={name}
            viewOnly
            onChange={this.updateOrganizationName} />
      </StyledSectionHeading>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationNameSectionComponent);
