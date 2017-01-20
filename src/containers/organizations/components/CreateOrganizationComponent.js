/*
 * @flow
 */

import React from 'react';

import Select from 'react-select';

import {
  DataModels,
  Types,
  OrganizationsApi,
  PermissionsApi
} from 'loom-data';

import {
  Button,
  Checkbox,
  ControlLabel,
  FormControl,
  FormGroup,
  HelpBlock
} from 'react-bootstrap';


import styles from '../styles/create.org.module.css';

import Utils from '../../../utils/Utils';

const {
  AceBuilder,
  AclBuilder,
  AclData,
  AclDataBuilder,
  Organization,
  OrganizationBuilder,
  PrincipalBuilder
} = DataModels;

const {
  ActionTypes,
  PermissionTypes,
  PrincipalTypes
} = Types;

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

    OrganizationsApi.createOrganization(org)
      .then((createdOrgId :string) => {

        const aclData :AclData = (new AclDataBuilder())
          .setAction(ActionTypes.SET)
          .setAcl(
            (new AclBuilder())
              .setAclKey([createdOrgId])
              .setAces([
                (new AceBuilder())
                  .setPermissions([PermissionTypes.READ])
                  .setPrincipal(
                    (new PrincipalBuilder())
                      .setType(PrincipalTypes.ROLE)
                      .setId('AuthenticatedUser')
                      .build()
                  )
                  .build()
              ])
              .build()
          )
          .build();

        PermissionsApi.updateAcl(aclData)
          .catch((e) => {
            console.error(e);
          });

        this.props.onCreate(createdOrgId);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  onChangeDomainTag = (value :Array<Object>) => {

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
