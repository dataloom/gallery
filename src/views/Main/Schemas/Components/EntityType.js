import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import FileService from '../../../../utils/FileService';
import { DataApi } from 'loom-data';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import FileConsts from '../../../../utils/Consts/FileConsts';
import PermissionConsts from '../../../../utils/Consts/PermissionConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    entityType: PropTypes.object,
    updateFn: PropTypes.func,
    allPropNamespaces: PropTypes.object,
    fqnToId: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      properties: []
    };
  }

  componentDidMount() {
    this.loadProperties();
  }

  loadProperties = () => {
    Promise.map(this.props.entityType.properties, (propertyId) => {
      return EntityDataModelApi.getPropertyType(propertyId);
    }).then((properties) => {
      this.setState({ properties });
    });
  }

  downloadFile = (datatype) => {
    const properties = {
      properties: this.state.properties
    };
    const entityType = Object.assign(this.props.entityType, properties);
    FileService.saveFile(entityType, this.props.entityType.title, datatype, this.enableButton);
  }

  updateEntityType = (newTypeUuid, action) => {
    let newPropertyIds = this.props.entityType.properties;
    if (action === PermissionConsts.ADD) {
      newPropertyIds = this.state.propertyIds.concat(newTypeUuid);
    }
    else if (action === PermissionConsts.REMOVE) {
      newPropertyIds = this.state.propertyIds.filter((id) => {
        return (id !== newTypeUuid[0]);
      });
    }
    EntityDataModelApi.updatePropertyTypesForEntityType(this.props.entityType.id, newPropertyIds)
    .then(() => {
      this.props.updateFn();
    });
  }

  render() {
    const { entityType, updateFn, allPropNamespaces, fqnToId } = this.props;
    const options = [FileConsts.CSV, FileConsts.JSON];
    return (
      <div className={styles.edmContainer}>
        <div className={styles.title}>{entityType.title}</div>
        <div className={styles.description}>{entityType.description}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.subtitle}>{`${entityType.type.namespace}.${entityType.type.name}`}</div>
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadFn={this.downloadFile} options={options} />
        </div>
        <div className={styles.spacerMed} />
        <PropertyList
          properties={this.state.properties}
          primaryKey={entityType.primaryKey}
          entityTypeName={entityType.type.name}
          entityTypeNamespace={entityType.type.namespace}
          updateFn={updateFn}
          allPropNamespaces={allPropNamespaces}
          propFqnsToId={fqnToId}
          editingPermissions={false}
        />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntityType;
