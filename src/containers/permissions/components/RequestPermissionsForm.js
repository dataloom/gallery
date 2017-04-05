import React, { PropTypes } from 'react';

import Immutable from 'immutable';

import { Button, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import PropertyTypeList from '../../edm/components/PropertyTypeList';
import styles from './permissions.module.css';

const PROPERTY_TYPE_EDITING = {
  permissions: true
};

export default class RequestPermissionsForm extends React.Component {
  static propTypes = {
    entitySetId: PropTypes.string.isRequired,
    propertyTypeIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onPermissionChange: PropTypes.func.isRequired,
    onReasonChange: PropTypes.func.isRequired,
    pidToRequestedPermissions: PropTypes.instanceOf(Immutable.Map),
    reason: PropTypes.string
  };

  static defaultProps = {
    pidToRequestedPermissions: Immutable.Map(),
    reason: ''
  };

  onSubmit = (event) => {
    event.preventDefault();
    const { entitySetId, pidToRequestedPermissions, reason, onSubmit } = this.props;

    const authNRequests = pidToRequestedPermissions.entrySeq().toArray().map(([pid, permissions]) => {
      return {
        aclKey: [entitySetId, pid],
        permissions,
        reason
      };
    });
    onSubmit(authNRequests);
  };

  onReasonChange = (event) => {
    const { onReasonChange } = this.props;
    onReasonChange(event.target.value);
  };

  render() {
    const { propertyTypeIds, entitySetId, onPermissionChange, reason } = this.props;

    return (
      <form className={styles.rqm} onSubmit={this.onSubmit}>
        <FormGroup>
          <ControlLabel>Reason for your request</ControlLabel>
          <FormControl componentClass="textarea" value={reason} onChange={this.onReasonChange} />
        </FormGroup>
        <h2 className={styles.subtitle}>Select properties you want access to:</h2>
        <PropertyTypeList
            entitySetId={entitySetId}
            propertyTypeIds={propertyTypeIds}
            editing={PROPERTY_TYPE_EDITING}
            onChange={onPermissionChange}
            requestingPermissions />
        <Button type="submit" bsStyle="primary" className={styles.submitButton}>Submit</Button>
      </form>
    );
  }
}
