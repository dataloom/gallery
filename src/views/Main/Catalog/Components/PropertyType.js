import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropTypes.object,
    navBar: PropTypes.bool,
    error: PropTypes.func,
    updateFn: PropTypes.func,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string
  }

  deleteProp = () => {
    EntityDataModelApi.removePropertyTypesFromSchema(
      {
        namespace: this.props.schemaNamespace,
        name: this.props.schemaName
      },
      [{
        namespace: this.props.propertyType.namespace,
        name: this.props.propertyType.name
      }]
    ).then(() => {
      return this.props.updateFn();
    }).catch(() => {
      return this.props.error();
    });
  }

  shouldShowDeleteButton = () => {
    return (this.props.navBar ? styles.hidden : Consts.EMPTY);
  }

  render() {
    const prop = this.props.propertyType;
    return (
      <tr className={styles.tableRows}>
        <td className={this.shouldShowDeleteButton()}>
          <button className={styles.deleteButton} onClick={this.deleteProp}>-</button>
        </td>
        <td className={styles.tableCell}>{prop.name}</td>
        <td className={styles.tableCell}>{prop.namespace}</td>
        <td className={styles.tableCell}>{prop.datatype}</td>
        <td className={styles.tableCell}>{prop.multiplicity}</td>
      </tr>
    );
  }
}

export default PropertyType;
