/*
 * @flow
 */

import React from 'react';

import {
  DataModels,
  OrganizationsApi
} from 'loom-data';

import {
  Button,
  Checkbox,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap';

import styles from '../styles/create.org.module.css';

const {
  Organization,
  OrganizationBuilder
} = DataModels;

class CreateOrganization extends React.Component {

  state :{
    title :string,
    domains :string,
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
      domains: '',
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

  handleOnChangeDomains = (e :Object) => {

    this.setState({
      domains: e.target.value
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

    const org :Organization = (new OrganizationBuilder())
      .setTitle(this.state.title)
      .setDescription(this.state.description)
      .build();

    OrganizationsApi.createOrganization(org);
  }

  render() {

    return (
      <div className={styles.createOrganizationWrapper}>
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
          <FormControl
              componentClass="input"
              type="text"
              placeholder="Domains..."
              onChange={this.handleOnChangeDomains} />
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
        <FormGroup>
          <Checkbox disabled>Google Apps Auth</Checkbox>
          <Checkbox disabled>Username - Password</Checkbox>
          <Checkbox disabled>LDAP</Checkbox>
        </FormGroup>
        <Button
            className={styles.createOrgSubmit}
            type="submit"
            bsStyle="primary"
            onClick={this.onClickCreate}>
          Create Organization
        </Button>
        <Button onClick={this.props.onCancel}>Cancel</Button>
      </div>
    );
  }
}

export default CreateOrganization;
