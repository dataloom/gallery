import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import { PropertyList } from '../../../../components/propertylist/PropertyList';
import { DropdownButton } from '../../../../components/dropdown/DropdownButton';
import FileService from '../../../../utils/FileService';
import FileConsts from '../../../../utils/Consts/FileConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    namespace: PropTypes.string,
    propertyIds: PropTypes.array,
    primaryKey: PropTypes.array,
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
    this.loadProperties();
  }

  loadProperties = () => {
    Promise.map(this.props.propertyIds, (propertyId) => {
      return EntityDataModelApi.getPropertyType(propertyId);
    }).then((properties) => {
      this.setState({ properties });
    });
  }

  downloadFile = (datatype) => {
    const entityType = {
      id: this.props.id,
      type: {
        namespace: this.props.namespace,
        name: this.props.name
      },
      primaryKey: this.props.primaryKey,
      propertyTypes: this.state.properties
    };
    FileService.saveFile(entityType, this.props.name, datatype, this.enableButton);
  }

  render() {
    const { name, namespace, primaryKey, updateFn, allPropNamespaces } = this.props;
    const options = [FileConsts.CSV, FileConsts.JSON];
    return (
      <div className={styles.edmContainer}>
        <div className={styles.name}>{name}</div>
        <div className={styles.spacerSmall} />
        <div className={styles.subtitle}>{namespace}</div>
        <div className={styles.dropdownButtonContainer}>
          <DropdownButton downloadFn={this.downloadFile} options={options} />
        </div>
        <div className={styles.spacerMed} />
        <PropertyList
          properties={this.state.properties}
          primaryKey={primaryKey}
          entityTypeName={name}
          entityTypeNamespace={namespace}
          updateFn={updateFn}
          allPropNamespaces={allPropNamespaces}
          editingPermissions={false}
        />
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntityType;
