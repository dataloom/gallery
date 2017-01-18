import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import StringConsts from '../../../../utils/Consts/StringConsts';
import Utils from '../../../../utils/Utils';
import styles from '../styles.module.css';

export class PropertyType extends React.Component {
  static propTypes = {
    propertyType: PropTypes.object,
    propertyTypePage: PropTypes.bool,
    error: PropTypes.func,
    updateFn: PropTypes.func,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
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

  renderDeleteButton = () => {
    const className = (this.props.propertyTypePage) ? styles.hidden : StringConsts.EMPTY;
    if (this.context.isAdmin) {
      return (
        <td className={className}>
          <button className={styles.deleteButton} onClick={this.deleteProp}>-</button>
        </td>
      );
    }
    return (
      <td className={className} />
    );
  }

  render() {
    const prop = this.props.propertyType;
    return (
      <tr className={styles.tableRows}>
        {this.renderDeleteButton()}
        <td className={styles.tableCell}>{prop.title}</td>
        <td className={styles.tableCell}>{prop.type.namespace}</td>
        <td className={styles.tableCell}>{prop.type.name}</td>
        <td className={styles.tableCell}>{prop.datatype}</td>
      </tr>
    );
  }
}

export default PropertyType;
