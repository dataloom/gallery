import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class Property extends React.Component {
  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    editingPermissions: PropTypes.bool,
    entitySetName: PropTypes.string
  }

  isPrimaryKey() {
    if (this.props.primaryKey) {
      return (<td className={styles.primaryKey}>(primary key)</td>);
    }
    return null;
  }

  editPermissionsButton() {
    if (this.props.editingPermissions) {
      return (<td><Button onClick={this.editPermissions}>Change permissions</Button></td>);
    }
    return null;
  }

  editPermissions() {
    console.log('editing permissions');
  }

  deleteProp = () => {
    EntityDataModelApi.removePropertyTypesFromEntityType(
      {
        namespace: this.props.entityTypeNamespace,
        name: this.props.entityTypeName
      },
      [{
        namespace: this.props.property.namespace,
        name: this.props.property.name
      }]
    ).then(() => this.props.updateFn());
  }

  shouldShowDeleteButton = () => (this.props.primaryKey ? styles.hidden : Consts.EMPTY);

  render() {
    const prop = this.props.property;
    return (
      <tr className={styles.tableRows}>
        <td>
          <Button
            bsSize="xsmall"
            bsStyle="danger"
            onClick={this.deleteProp}
            className={this.shouldShowDeleteButton()}
          >-</Button>
        </td>
        <td className={styles.tableCell}>{prop.name}</td>
        <td className={styles.tableCell}>{prop.namespace}</td>
        {this.isPrimaryKey()}
        {this.editPermissionsButton()}
      </tr>
    );
  }
}

export default Property;
