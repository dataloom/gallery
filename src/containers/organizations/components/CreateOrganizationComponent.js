/*
 * @flow
 */

import React from 'react';

import {
  Button,
  Checkbox,
  ControlLabel,
  FormControl,
  FormGroup
} from 'react-bootstrap';

import styles from '../styles/orgs.module.css';

class CreateOrganization extends React.Component {

  static propTypes = {
    visibilityOptions: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    onCreate: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  }

  getVisibilityOptions = () => {

    return this.props.visibilityOptions.map((visibility) => {
      return (
        <option key={visibility} value={visibility}>{visibility}</option>
      );
    });
  }

  render() {
    return (
      <div className={styles.createOrganizationWrapper}>
        <h3>Create Organization</h3>
        <FormGroup>
          <ControlLabel>Organization</ControlLabel>
          <FormControl componentClass="input" type="text" placeholder="Organization..." />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Domains</ControlLabel>
          <FormControl componentClass="input" type="text" placeholder="Domains..." />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
              className={styles.orgDescription}
              componentClass="textarea"
              placeholder="Organization description..." />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Visibility</ControlLabel>
          <FormControl componentClass="select" placeholder="Visibility" onChange={() => {}}>
            { this.getVisibilityOptions() }
          </FormControl>
        </FormGroup>
        <FormGroup>
          <Checkbox>Google Apps Auth</Checkbox>
          <Checkbox>Username - Password</Checkbox>
          <Checkbox>LDAP</Checkbox>
        </FormGroup>
        <Button
            className={styles.createOrgSubmit}
            type="submit"
            bsStyle="primary"
            onClick={this.props.onCreate}>
          Create Organization
        </Button>
        <Button onClick={this.props.onCancel}>Cancel</Button>
      </div>
    );
  }
}

export default CreateOrganization;
