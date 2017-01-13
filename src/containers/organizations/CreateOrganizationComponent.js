/*
 * @flow
 */

import React from 'react';

import styles from './organizations.module.css';

import {
  Button,
  Checkbox,
  ControlLabel,
  Form,
  FormControl,
  FormGroup
} from 'react-bootstrap';

class CreateOrganization extends React.Component {

  static propTypes = {
    visibilityOptions: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    actions: React.PropTypes.shape({
      onCreateOrganization: React.PropTypes.func.isRequired,
    })
  }

  render() {
    return (
      <div>
        <h3>Create Organization</h3>
        <Form>
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
              <option value="select">Discoverable</option>
              <option value="other">Public</option>
              <option value="other">Private</option>
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
            onClick={() => {}}>
            Create Organization
          </Button>
          <Button onChange={() => {}}>Cancel</Button>
        </Form>
      </div>
    );
  }
}

export default CreateOrganization;
