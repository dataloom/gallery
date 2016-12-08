import React, { PropTypes } from 'react';
import { DataApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import FileConsts from '../../../../utils/Consts/FileConsts';
import Utils from '../../../../utils/Utils';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    namespace: PropTypes.string,
    properties: PropTypes.array,
    primaryKey: PropTypes.array,
    updateFn: PropTypes.func,
    allPropNamespaces: PropTypes.object,
    isAdmin: PropTypes.bool
  }

  getUrl = (datatype) => {
    return DataApi.getAllEntitiesOfTypeFileUrl(Utils.getFqnObj(this.props.namespace, this.props.name), datatype);
  }

  render() {
    const { name, namespace, properties, primaryKey, updateFn, allPropNamespaces, isAdmin } = this.props;
    const options = [FileConsts.CSV, FileConsts.JSON];
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.subtitle}>{namespace}</div>
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadUrlFn={this.getUrl} options={options} />
        </div>
        <div className={styles.spacerMed} />
        <PropertyList
          properties={properties}
          primaryKey={primaryKey}
          entityTypeName={name}
          entityTypeNamespace={namespace}
          updateFn={updateFn}
          allPropNamespaces={allPropNamespaces}
          editingPermissions={false}
          isAdmin={isAdmin}
        />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntityType;
