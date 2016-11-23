import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import StringConsts from '../../../../utils/Consts/StringConsts';
import Utils from '../../../../utils/Utils';
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
    const { schemaName, schemaNamespace, propertyType, updateFn, error } = this.props;
    EntityDataModelApi.removePropertyTypesFromSchema(Utils.getFqnObj(schemaNamespace, schemaName), [propertyType])
    .then(() => {
      return updateFn();
    }).catch(() => {
      return error();
    });
  }

  shouldShowDeleteButton = () => {
    return (this.props.navBar ? styles.hidden : StringConsts.EMPTY);
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
