/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import StyledFlexContainerStacked from '../../../components/flex/StyledFlexContainerStacked';

import StyledSectionHeading from './StyledSectionHeading';

import {
  RemoveButton,
  StyledElement,
  StyledListItem
} from '../../../components/controls/StyledListGroup';

import {
  fetchUsersRequest
} from '../../principals/PrincipalsActionFactory';

import {
  removeMemberFromOrganizationRequest
} from '../actions/OrganizationActionFactory';

const MemberListContainer = styled.div`
  width: 500px;
`;

const MemberLabel = styled(StyledElement)`
  flex: 1 0 auto;
`;

function mapStateToProps(state :Immutable.Map, ownProps :Object) {

  const users :Immutable.List = state.getIn(['principals', 'users'], Immutable.Map());

  const members :Immutable.Map = Immutable.Map().withMutations((map :Immutable.Map) => {
    ownProps.organization.get('members', Immutable.List()).forEach((member :Immutable.Map) => {
      const memberId = member.get('id');
      const user = users.get(memberId);
      if (user) {
        map.set(memberId, user);
      }
    });
  });

  console.log(members.toJS());

  return {
    members
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchUsersRequest,
    removeMemberFromOrganizationRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationMembersSectionComponent extends React.Component {

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchUsersRequest: React.PropTypes.func.isRequired,
      removeMemberFromOrganizationRequest: React.PropTypes.func.isRequired
    }).isRequired,
    members: React.PropTypes.instanceOf(Immutable.Map).isRequired,
    organization: React.PropTypes.instanceOf(Immutable.Map).isRequired
  }

  componentDidMount() {

    const memberIds :string[] = this.props.organization
      .get('members', Immutable.List())
      .map((member :Immutable.Map) => {
        return member.get('id');
      }).toJS();

    // TODO: figure out why componentDidMount() happens multiple times
    console.log('OrganizationMembersSectionComponent.componentDidMount()');
    this.props.actions.fetchUsersRequest(memberIds);
  }

  handleOnClickRemoveUser = (userId :string) => {

    if (!userId) {
      // TODO: this shouldn't happen, how do we handle it?
      return;
    }

    this.props.actions.removeMemberFromOrganizationRequest(
      this.props.organization.get('id'),
      userId
    );
  }

  render() {

    const isOwner :boolean = this.props.organization.get('isOwner', false);

    let sectionContent = [];
    if (this.props.members.isEmpty()) {
      sectionContent = (
        <span>No members.</span>
      );
    }
    else {

      const memberList = [];
      this.props.members.forEach((member :Immutable.Map) => {

        // TODO: refactor, same logic as OrganizationAddMembersSectionComponent
        const memberId :string = member.get('user_id');
        const nickname :string = member.get('nickname');
        const username :string = member.get('username');
        const email :string = member.get('email');

        let label :string = nickname || username;

        if (email) {
          label = `${label} - ${email}`;
        }

        if (memberId.startsWith('auth0')) {
          label = `${label} - Auth0`;
        }
        else if (memberId.startsWith('facebook')) {
          label = `${label} - Facebook`;
        }
        else if (memberId.startsWith('google')) {
          label = `${label} - Google`;
        }

        const memberListItem = (
          <StyledListItem key={memberId}>
            <MemberLabel>{ label }</MemberLabel>
            {
              isOwner && (
                <RemoveButton
                    onClick={() => {
                      this.handleOnClickRemoveUser(memberId);
                    }} />
              )
            }
          </StyledListItem>
        );

        memberList.push(memberListItem);
      });

      sectionContent = (
        <MemberListContainer>
          { memberList }
        </MemberListContainer>
      );
    }

    return (
      <StyledFlexContainerStacked>
        <StyledSectionHeading>
          <h3>Members</h3>
          <h5>These users are members of this orgnization. Click on a member to view their roles.</h5>
        </StyledSectionHeading>
        { sectionContent }
      </StyledFlexContainerStacked>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationMembersSectionComponent);
