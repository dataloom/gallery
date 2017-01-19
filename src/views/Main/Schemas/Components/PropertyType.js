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
      <div className={styles.edmContainer}>
        <div className={styles.italic}>{`${prop.type.namespace}.${prop.type.name}`}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.title}>{prop.title}</div>
        <div className={styles.description}>{prop.description}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.italic}>datatype: {prop.datatype}</div>
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default PropertyType;
