import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import styles from '../styles.module.css';

export class Property extends React.Component {
  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool,
    entityTypeName: PropTypes.string,
    entityTypeNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    entitySetName: PropTypes.string
  }

  isPrimaryKey() {
    const pKey = this.props.primaryKey;
    if (pKey) {
      return (<td className={styles.primaryKey}>(primary key)</td>);
    }
    return null;
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
    ).then(() => {
      return this.props.updateFn();
    });
  }

  shouldShowDeleteButton = () => {
    return (this.props.primaryKey || this.props.entitySetName) ? styles.hidden : styles.deleteButton;
  }

  render() {
    const prop = this.props.property;
    return (
      <tr className={styles.tableRows}>
        <td>
          <button
            onClick={this.deleteProp}
            className={this.shouldShowDeleteButton()}
          >-</button>
        </td>
        <td className={styles.tableCell}>{prop.name}</td>
        <td className={styles.tableCell}>{prop.namespace}</td>
        {this.isPrimaryKey()}
      </tr>
    );
  }
}

export default Property;
