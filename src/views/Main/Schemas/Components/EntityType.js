import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import FileService from '../../../../utils/FileService';
import { PropertyList } from './PropertyList';
import { DropdownButton } from './DropdownButton';
import FileConsts from '../../../../utils/Consts/FileConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    entityType: PropTypes.object,
    updateFn: PropTypes.func,
    allPropNamespaces: PropTypes.object
  }

  constructor() {
    super();
    this.state = {
      properties: []
    };
  }

  componentDidMount() {
    this.loadProperties(this.props.entityType.properties);
  }

  componentWillReceiveProps(nextProps) {
    this.loadProperties(nextProps.entityType.properties);
  }

  loadProperties = (propertyIds) => {
    Promise.map(propertyIds, (propertyId) => {
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
    if (action === ActionConsts.ADD) {
      EntityDataModelApi.addPropertyTypesToEntityType(this.props.entityType.id, newTypeUuid[0])
      .then(() => {
        this.props.updateFn();
      });
    }
    else if (action === ActionConsts.REMOVE) {
      EntityDataModelApi.removePropertyTypesFromEntityType(this.props.entityType.id, newTypeUuid[0])
      .then(() => {
        this.props.updateFn();
      });
    }
  }

  render() {
    const { entityType, allPropNamespaces } = this.props;
    const options = [FileConsts.JSON];
    return (
      <div>
        <div className={styles.italic}>{`${entityType.type.namespace}.${entityType.type.name}`}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.title}>{entityType.title}</div>
        <div className={styles.description}>{entityType.description}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadFn={this.downloadFile} options={options} />
        </div>
        <div className={styles.spacerMed} />
        <PropertyList
            properties={this.state.properties}
            primaryKey={entityType.key}
            entityTypeName={entityType.type.name}
            entityTypeNamespace={entityType.type.namespace}
            updateFn={this.updateEntityType}
            allPropNamespaces={allPropNamespaces}
            editingPermissions={false} />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntityType;
