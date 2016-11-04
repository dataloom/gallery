import React, { PropTypes } from 'react';
import { DataApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    updateFn: PropTypes.func,
    allPropNames: PropTypes.object,
    allPropNamespaces: PropTypes.object
  }

  getUrl = (datatype) => {
    return DataApi.getAllEntitiesOfTypeFileUrl({ namespace: this.props.namespace, name: this.props.name }, datatype);
  }

  render() {
    const { name, namespace, properties, primaryKey, updateFn } = this.props;
    const downloadOptions = [Consts.CSV, Consts.JSON];
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.subtitle}>{namespace}</div>
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadUrlFn={this.getUrl} downloadOptions={downloadOptions} />
        </div>
        <div className={styles.spacerMed} />
        <PropertyList
          properties={properties}
          primaryKey={primaryKey}
          entityTypeName={name}
          entityTypeNamespace={namespace}
          updateFn={updateFn}
          allPropNames={this.props.allPropNames}
          allPropNamespaces={this.props.allPropNamespaces}
          allowEdit
          editingPermissions={false}
        />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntityType;
