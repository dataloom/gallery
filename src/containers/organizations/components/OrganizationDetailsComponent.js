/*
 * @flow
 */

import React from 'react';

import Immutable from 'immutable';
import FontAwesome from 'react-fontawesome';
import classnames from 'classnames';

import {
  DataModels,
  Types,
  AuthorizationApi,
  OrganizationApi,
  PermissionsApi,
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
  ListGroupItem,
  Table
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

import {
  fetchOrgRequest,
  joinOrgRequest,
  addRoleToOrgRequest,
  removeRoleFromOrgRequest
} from '../actions/OrganizationsActionFactory';

const {
  Organization
} = DataModels;

function mapStateToProps(state :Map<*, *>, ownProps :Object) {

  const orgId :string = ownProps.params.orgId;
  const emptyOrg = Immutable.fromJS({});

  return {
    organization: state.getIn(['organizations', 'organizations', orgId], emptyOrg)
  };
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    fetchOrgRequest,
    joinOrgRequest,
    addRoleToOrgRequest,
    removeRoleFromOrgRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class OrganizationDetails extends React.Component {

  state :{
    isInvalidEmail :boolean,
    newRoleValue :string
  }

  static propTypes = {
    actions: React.PropTypes.shape({
      fetchOrgRequest: React.PropTypes.func.isRequired,
      joinOrgRequest: React.PropTypes.func.isRequired
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
      newRoleValue: ''
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

  renderDomainsSection = () => {

    const domains = this.props.organization.get('emails', []).map((domain :string) => {
      return (
        <ListGroupItem key={domain}>{ domain }</ListGroupItem>
      );
    });

    return (
      <div className={classnames(styles.detailSection, styles.domains)}>
        <h4>Domains</h4>
        <ListGroup>
          { domains }
        </ListGroup>
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

    const roleListGroup = (
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
        { roleListGroup }
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
        { this.renderInvitationSection() }
        { this.renderDomainsSection() }
        { this.renderRolesSection() }
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDetails);
