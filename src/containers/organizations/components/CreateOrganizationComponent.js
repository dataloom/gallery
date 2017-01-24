/*
 * @flow
 */

import React from 'react';

import Select from 'react-select';

import {
  DataModels
} from 'loom-data';

import {
  Button,
  Checkbox,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock
} from 'react-bootstrap';

import {
  connect
} from 'react-redux';

import {
  bindActionCreators
} from 'redux';

import styles from '../styles/create.org.module.css';

import Utils from '../../../utils/Utils';

import {
  createNewOrgRequest
} from '../actions/OrganizationsActionFactory';

const {
  Organization,
  OrganizationBuilder
} = DataModels;

function mapStateToProps(state :Map<*, *>) {

  return {};
}

function mapDispatchToProps(dispatch :Function) {

  const actions = {
    createNewOrgRequest
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

class CreateOrganization extends React.Component {

  state :{
    title :string,
    domains :Array<Object>,
    description :string,
    visibility :string
  };

  static propTypes = {
    onCreate: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  }

  constructor(props :Object) {

    super(props);

    this.state = {
      title: '',
      domains: [],
      description: '',
      visibility: ''
    };
  }

  getVisibilityOptions = () => {

    const visibilityOptions = [
      'Discoverable',
      'Public',
      'Private'
    ];

    return visibilityOptions.map((visibility) => {
      return (
        <option key={visibility} value={visibility}>{visibility}</option>
      );
    });
  }

  handleOnChangeTitle = (e :Object) => {

    this.setState({
      title: e.target.value
    });
  }

  handleOnChangeDescription = (e :Object) => {

    this.setState({
      description: e.target.value
    });
  }

  handleOnChangeVisibility = (e :Object) => {

    this.setState({
      visibility: e.target.value
    });
  }

  onClickCreate = () => {

    const emailDomains = this.state.domains.map((obj) => {
      return obj.value;
    });

    const org :Organization = (new OrganizationBuilder())
      .setTitle(this.state.title)
      .setDescription(this.state.description)
      .setAutoApprovedEmails(emailDomains)
      .build();

    this.props.actions.createNewOrgRequest(org);

    // TODO: need to add some kind of indication that the form is submitting, show an error if something went wrong,
    // hide the form on success, and update the list of organizations
    this.props.onCreate();
  }

  onChangeDomainTag = (value :Object[]) => {

    this.setState({
      domains: value
    });
  }

  isValidDomain = (value :Object) => {

    return Utils.isValidEmail(`test@${value.label}`);
  }

  render() {

    return (
      <div>
        <h3>Create Organization</h3>
        <FormGroup>
          <ControlLabel>Organization</ControlLabel>
          <FormControl
              componentClass="input"
              type="text"
              placeholder="Organization..."
              onChange={this.handleOnChangeTitle} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Domains</ControlLabel>
          <Select.Creatable
              multi
              options={[]}
              value={this.state.domains}
              onChange={this.onChangeDomainTag}
              isValidNewOption={this.isValidDomain} />
          <HelpBlock>{ 'Ex: kryptnostic.com' }</HelpBlock>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
              className={styles.orgDescription}
              componentClass="textarea"
              placeholder="Organization description..."
              onChange={this.handleOnChangeDescription} />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Visibility</ControlLabel>
          <FormControl
              componentClass="select"
              placeholder="Visibility"
              onChange={this.handleOnChangeVisibility}>
            { this.getVisibilityOptions() }
          </FormControl>
        </FormGroup>
        <FormGroup style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Button
              className={styles.createOrgSubmit}
              type="submit"
              bsStyle="primary"
              onClick={this.onClickCreate}>
            Create Organization
          </Button>
          <Button onClick={this.props.onCancel}>Cancel</Button>
        </FormGroup>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganization);
