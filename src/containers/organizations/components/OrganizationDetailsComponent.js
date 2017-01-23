/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import Select from 'react-select';
import classnames from 'classnames';

import {
  DataModels,
  PrincipalsApi
} from 'loom-data';

import {
  Button,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock,
  InputGroup,
  Label,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';

import {
  connect
} from 'react-redux';

import {
  hashHistory
} from 'react-router';

import {
  bindActionCreators
} from 'redux';

import styles from '../styles/orgs.module.css';

import Utils from '../../../utils/Utils';

import {
  fetchOrgRequest,
  joinOrgRequest,
  addDomainToOrgRequest,
  removeDomainFromOrgRequest,
  addRoleToOrgRequest,
  removeRoleFromOrgRequest,
  addMemberToOrgRequest,
  removeMemberFromOrgRequest
} from '../actions/OrganizationsActionFactory';

import {
  setUserRolesRequest
} from '../actions/UsersActionFactory';

const {
  Organization
} = DataModels;

function mapStateToProps(state :Map<*, *>, ownProps :Object) {

  const orgId :string = ownProps.params.orgId;
  const emptyMap = Immutable.fromJS({});

  const users = state.getIn(['users', 'users'], emptyMap);
  const selectMemberOptions = users.map((user) => {

    const nickname = user.get('nickname');
    const username = user.get('username');
    const email = user.get('email');

    let label = nickname || username;
    if (email) {
      label = `${label} - ${email}`;
    }

    return {
      value: user.get('user_id'),
      label
    };
  }).valueSeq().toJS();

  return {
    organization: state.getIn(['organizations', 'organizations', orgId], emptyMap),
    selectMemberOptions,
    users
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrgRequest,
    joinOrgRequest,
    addDomainToOrgRequest,
    removeDomainFromOrgRequest,
    addRoleToOrgRequest,
    removeRoleFromOrgRequest,
    addMemberToOrgRequest,
    removeMemberFromOrgRequest,
    setUserRolesRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDetails extends React.Component {

  state :{
    isInvalidEmail :boolean,
    newDomainValue :string,
    newRoleValue :string,
    newMemberValue :?Object,
    newMemberRoles :string[]
  }

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrgRequest: React.PropTypes.func.isRequired,
      joinOrgRequest: React.PropTypes.func.isRequired,
      addDomainToOrgRequest: React.PropTypes.func.isRequired,
      removeDomainFromOrgRequest: React.PropTypes.func.isRequired,
      addRoleToOrgRequest: React.PropTypes.func.isRequired,
      removeRoleFromOrgRequest: React.PropTypes.func.isRequired,
      addMemberToOrgRequest: React.PropTypes.func.isRequired,
      removeMemberFromOrgRequest: React.PropTypes.func.isRequired
    }).isRequired,
    params: React.PropTypes.shape({
      orgId: React.PropTypes.string.isRequired
    }).isRequired,
    organization: React.PropTypes.shape(Organization).isRequired
  }

  constructor(props :Object) {

    super(props);

    this.state = {
      isInvalidEmail: false,
      newDomainValue: '',
      newRoleValue: '',
      newMemberValue: null,
      newMemberRoles: []
    };
  }

  renderOrgTitleSection = () => {

    return (
      <div className={classnames(styles.orgTitleSectionWrapper)}>
        <div className={classnames(styles.orgTitleOwnerWrapper)}>
          <h3 className={classnames(styles.orgTitle)}>
            { this.props.organization.get('title') }
          </h3>
          {
            this.props.organization.get('isOwner') === true
            ? (
              <h5 className={classnames(styles.orgIsOwnerLabel)}>
                <Label bsStyle="success">Owner</Label>
              </h5>
            )
            : null
          }
        </div>
        {
          this.props.organization.get('isOwner') === false
            ? this.renderJoinOrgButton()
            : null
        }
      </div>
    );
  }

  renderJoinOrgButton = () => {

    // TODO: wire up join button
    // return (
    //   <Button
    //       className={classnames(styles.orgJoinButton)}
    //       onClick={this.props.actions.joinOrgRequest}>
    //     Request to Join
    //   </Button>
    // );
    return null;
  }

  renderInvitationSection = () => {

    return (
      <div className={styles.detailSection}>
        <h4>Invite</h4>
        <FormGroup className={styles.inviteInput}>
          <ControlLabel>Email Address</ControlLabel>
          <InputGroup>
            <FormControl type="text" placeholder="Enter email" onChange={() => {}} />
            <InputGroup.Button>
              <Button onClick={() => {}}>Invite</Button>
            </InputGroup.Button>
          </InputGroup>
          <HelpBlock className={styles.invalidEmail}>
            { (this.props.isInvalidEmail) ? 'Invalid email' : '' }
          </HelpBlock>
        </FormGroup>
      </div>
    );
  }

  onChangeNewDomainInput = (event) => {

    this.setState({
      newDomainValue: event.target.value
    });
  }

  onKeyPressNewDomainInput = (event) => {

    if (event.key === 'Enter') {
      this.addNewDomain();
    }
  }

  addNewDomain = () => {

    if (!Utils.isValidEmail(`test@${this.state.newDomainValue}`)) {
      console.log('TODO: show an error message to the user that the email is invalid');
      return;
    }

    this.props.actions.addDomainToOrgRequest(
      this.props.organization.get('id'),
      this.state.newDomainValue
    );

    this.setState({
      newDomainValue: ''
    });
  }


  renderDomainsSection = () => {

    const orgDomainsList :List<*> = this.props.organization.get('emails', Immutable.List());

    const domainListItems = orgDomainsList.map((domain) => {
      return (
        <ListGroupItem key={domain} className={classnames(styles.roleRowWrapper)}>
          <ul className={classnames(styles.roleRow)}>
            <li className={classnames(styles.roleRowItem, styles.roleRowItemId)}>
              { domain }
            </li>
            {
              this.props.organization.get('isOwner') === true
                ? (
                  <li className={classnames(styles.roleRowItem, styles.roleRowItemDelete)}>
                    <button
                        onClick={() => {
                          this.props.actions.removeDomainFromOrgRequest(
                            this.props.organization.get('id'),
                            domain
                          );
                        }}>
                      <FontAwesome name="minus-square-o" />
                    </button>
                  </li>
                )
              : null
            }
          </ul>
        </ListGroupItem>
      );
    });

    const addDomainListItem = (
      <ListGroupItem key={'addNewDomain'} className={classnames(styles.roleRowWrapper)}>
        <ul className={classnames(styles.roleRow)}>
          <li className={classnames(styles.roleRowItem, styles.roleRowItemAdd)}>
            <FormGroup bsSize="small" className={classnames(styles.roleRowItemAddInput)}>
              <FormControl
                  type="text"
                  placeholder="Add new domain..."
                  value={this.state.newDomainValue}
                  onChange={this.onChangeNewDomainInput}
                  onKeyPress={this.onKeyPressNewDomainInput} />
            </FormGroup>
          </li>
          <li className={classnames(styles.roleRowItem, styles.roleRowItemAddButton)}>
            <button onClick={this.addNewDomain}>
              <FontAwesome name="plus-square-o" />
            </button>
          </li>
        </ul>
      </ListGroupItem>
    );

    const domainsListGroup = (
      <ListGroup>
        { domainListItems }
        {
          this.props.organization.get('isOwner') === true
           ? addDomainListItem
           : null
        }
      </ListGroup>
    );

    return (
      <div className={styles.detailSection}>
        <h4>Domains</h4>
        <h5>
          { 'Users from these domains will automatically be approved when requesting to join this organization.' }
        </h5>
        { domainsListGroup }
      </div>
    );
  }

  onChangeNewRoleInput = (event) => {

    this.setState({
      newRoleValue: event.target.value
    });
  }

  onKeyPressNewRoleInput = (event) => {

    if (event.key === 'Enter') {
      this.addNewRole();
    }
  }

  addNewRole = () => {

    this.props.actions.addRoleToOrgRequest(
      this.props.organization.get('id'),
      this.state.newRoleValue
    );

    this.setState({
      newRoleValue: ''
    });
  }

  renderRolesSection = () => {

    const orgRolesList :List<*> = this.props.organization.get('roles', Immutable.List());

    const roleListItems = orgRolesList.map((role) => {
      return (
        <ListGroupItem key={role.get('id')} className={classnames(styles.roleRowWrapper)}>
          <ul className={classnames(styles.roleRow)}>
            <li className={classnames(styles.roleRowItem, styles.roleRowItemId)}>
              { role.get('id') }
            </li>
            {
              this.props.organization.get('isOwner') === true
                ? (
                  <li className={classnames(styles.roleRowItem, styles.roleRowItemDelete)}>
                    <button
                        onClick={() => {
                          this.props.actions.removeRoleFromOrgRequest(
                            this.props.organization.get('id'),
                            role.get('id')
                          );
                        }}>
                      <FontAwesome name="minus-square-o" />
                    </button>
                  </li>
                )
              : null
            }
          </ul>
        </ListGroupItem>
      );
    });

    const addRoleListItem = (
      <ListGroupItem key={'addNewRole'} className={classnames(styles.roleRowWrapper)}>
        <ul className={classnames(styles.roleRow)}>
          <li className={classnames(styles.roleRowItem, styles.roleRowItemAdd)}>
            <FormGroup bsSize="small" className={classnames(styles.roleRowItemAddInput)}>
              <FormControl
                  type="text"
                  placeholder="Add new role..."
                  value={this.state.newRoleValue}
                  onChange={this.onChangeNewRoleInput}
                  onKeyPress={this.onKeyPressNewRoleInput} />
            </FormGroup>
          </li>
          <li className={classnames(styles.roleRowItem, styles.roleRowItemAddButton)}>
            <button onClick={this.addNewRole}>
              <FontAwesome name="plus-square-o" />
            </button>
          </li>
        </ul>
      </ListGroupItem>
    );

    const rolesListGroup = (
      <ListGroup>
        { roleListItems }
        {
          this.props.organization.get('isOwner') === true
           ? addRoleListItem
           : null
        }
      </ListGroup>
    );

    return (
      <div className={styles.detailSection}>
        <h4>Roles</h4>
        <h5>You will be able to use the Roles below to manage permissions on Entity Sets that you own.</h5>
        { rolesListGroup }
      </div>
    );
  }

  onChangeNewMemberRoles = (roles :Object[]) => {

    this.setState({
      newMemberRoles: roles
    });
  }

  onChangeNewMemberSelect = (member) => {

    this.setState({
      newMemberValue: member
    });
  }

  addNewMember = () => {

    if (!this.state.newMemberValue || !this.state.newMemberRoles || this.state.newMemberRoles.length === 0) {
      return;
    }

    const userId = this.state.newMemberValue.value;

    this.props.actions.addMemberToOrgRequest(
      this.props.organization.get('id'),
      userId
    );

    const roles = this.state.newMemberRoles.map((obj) => {
      return obj.value;
    });

    this.props.actions.setUserRolesRequest(
      userId,
      roles
    );

    this.setState({
      newMemberValue: null,
      newMemberRoles: []
    });
  }

  renderMembersSection =() => {

    const orgRolesList :List<*> = this.props.organization.get('roles', Immutable.List());
    const orgMembersList :List<*> = this.props.organization.get('members', Immutable.List());

    const selectRolesOptions = orgRolesList.map((role) => {
      return {
        label: role.get('id'),
        value: role.get('id')
      };
    }).toJS();

    const memberListItems = orgMembersList.map((member) => {

      const user :Immutable.Map<string, Object> = this.props.users.get(member.get('id'), Immutable.Map());
      if (user.isEmpty()) {
        return null;
      }

      // TODO: refactor
      const nickname = user.get('nickname');
      const username = user.get('username');
      const email = user.get('email');

      let label = nickname || username;
      if (email) {
        label = `${label} - ${email}`;
      }

      return (
        <ListGroupItem key={user.get('user_id')} className={classnames(styles.roleRowWrapper)}>
          <ul className={classnames(styles.roleRow)}>
            <li className={classnames(styles.roleRowItem, styles.roleRowItemId)}>
              { label }
            </li>
            {
              this.props.organization.get('isOwner') === true
                ? (
                  <li className={classnames(styles.roleRowItem, styles.roleRowItemDelete)}>
                    <button
                        onClick={() => {
                          this.props.actions.removeMemberFromOrgRequest(
                            this.props.organization.get('id'),
                            user.get('user_id')
                          );
                        }}>
                      <FontAwesome name="minus-square-o" />
                    </button>
                  </li>
                )
              : null
            }
          </ul>
        </ListGroupItem>
      );
    });

    const addMemberForm = (
      <div className={classnames(styles.addMemberWrapper)}>
        <div className={classnames(styles.addMemberMemberSelectWrapper)}>
          <Select
              className={classnames(styles.addMemberMemberSelect)}
              placeholder="Add new member..."
              options={this.props.selectMemberOptions}
              value={this.state.newMemberValue}
              onChange={this.onChangeNewMemberSelect} />
        </div>
        <div className={classnames(styles.addMemberRoleSelectWrapper)}>
          <Select
              className={classnames(styles.addMemberRoleSelect)}
              multi
              placeholder="Select roles..."
              options={selectRolesOptions}
              value={this.state.newMemberRoles}
              onChange={this.onChangeNewMemberRoles} />
        </div>
        <div>
          <Button bsStyle="primary" onClick={this.addNewMember}>
            Add Member
          </Button>
        </div>
      </div>
    );

    const membersListGroup = (
      <ListGroup>
        { memberListItems }
      </ListGroup>
    );

    return (
      <div className={styles.detailSection}>
        <h4>Members</h4>
        <h5>{ 'These users are members of this orgnization.' }</h5>
        {
          this.props.organization.get('isOwner') === true
          ? addMemberForm
          : null
        }
        { membersListGroup }
      </div>
    );
  }

  render() {

    return (
      <div className={classnames(styles.flexComponent)}>
        <div className={classnames(styles.flexComponent, styles.detailSection)}>
          { this.renderOrgTitleSection() }
          <h4>
            { this.props.organization.get('description') }
          </h4>
        </div>
        { this.renderDomainsSection() }
        { this.renderRolesSection() }
        { this.renderMembersSection() }
        <div style={{ margin: '50px 0' }} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetails);
