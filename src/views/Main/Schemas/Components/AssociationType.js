import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import InlineEditableControl from '../../../../components/controls/InlineEditableControl';
import FileService from '../../../../utils/FileService';
import { PropertyList } from './PropertyList';
import { EntityTypeOverviewList } from './EntityTypeOverviewList';
import FileConsts from '../../../../utils/Consts/FileConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import styles from '../styles.module.css';

export class AssociationType extends React.Component {
  static propTypes = {
    associationType: PropTypes.object.isRequired,
    idToPropertyTypes: PropTypes.object.isRequired,
    idToEntityTypes: PropTypes.object.isRequired
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      properties: [],
      srcEntityTypes: [],
      dstEntityTypes: []
    };
  }

  componentDidMount() {
    this.loadPropertyTypesAndEntityTypes(this.props.associationType);
  }

  componentWillReceiveProps(nextProps) {
    this.loadPropertyTypesAndEntityTypes(nextProps.associationType);
  }

  loadPropertyTypesAndEntityTypes = (associationType) => {
    const properties = associationType.entityType.properties.map((id) => {
      return this.props.idToPropertyTypes[id];
    });
    const srcEntityTypes = associationType.src.map((id) => {
      return this.props.idToEntityTypes[id];
    });
    const dstEntityTypes = associationType.dst.map((id) => {
      return this.props.idToEntityTypes[id];
    });
    this.setState({ properties, srcEntityTypes, dstEntityTypes });
  }

  updateFn = () => {
    EntityDataModelApi.getEntityType(this.props.associationType.entityType.id)
    .then((entityType) => {
      Promise.map(entityType.properties, (propertyId) => {
        return EntityDataModelApi.getPropertyType(propertyId);
      }).then((properties) => {
        this.setState({ properties });
      });
    });
  }

  downloadFile = () => {
    const properties = {
      properties: this.state.properties
    };
    const entityType = Object.assign(this.props.associationType, properties);
    FileService.saveFile(entityType, this.props.associationType.entityType.title, FileConsts.JSON, this.enableButton);
  }

  updateEntityType = (newTypeUuid, action) => {
    if (action === ActionConsts.ADD) {
      EntityDataModelApi.addPropertyTypeToEntityType(this.props.associationType.entityType.id, newTypeUuid[0])
      .then(() => {
        this.updateFn();
      });
    }
    else if (action === ActionConsts.REMOVE) {
      EntityDataModelApi.removePropertyTypeFromEntityType(this.props.associationType.entityType.id, newTypeUuid[0])
      .then(() => {
        this.updateFn();
      });
    }
  }

  updateEntityTypeTitle = (title) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.associationType.entityType.id, { title })
    .then(() => {
      this.updateFn();
    });
  }

  updateEntityTypeDescription = (description) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.associationType.entityType.id, { description })
    .then(() => {
      this.updateFn();
    });
  }

  render() {
    const entityType = this.props.associationType.entityType;
    const srcFqns = this.state.srcEntityTypes.map((srcEntityType) => {
      return srcEntityType.type;
    });
    const dstFqns = this.state.dstEntityTypes.map((dstEntityType) => {
      return dstEntityType.type;
    });
    return (
      <div>
        <div className={styles.italic}>{`${entityType.type.namespace}.${entityType.type.name}`}</div>
        <div className={styles.spacerSmall} />
        <InlineEditableControl
            type="text"
            size="xlarge"
            placeholder="Association type title..."
            value={entityType.title}
            viewOnly={!this.context.isAdmin}
            onChange={this.updateEntityTypeTitle} />
        <InlineEditableControl
            type="textarea"
            size="small"
            placeholder="Association type description..."
            value={entityType.description}
            viewOnly={!this.context.isAdmin}
            onChange={this.updateEntityTypeDescription} />
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownButtonContainer}>
          <Button bsStyle="primary" onClick={this.downloadFile}>Download as JSON</Button>
        </div>
        <div className={styles.spacerMed} />
        <PropertyList
            properties={this.state.properties}
            primaryKey={entityType.key}
            entityTypeName={entityType.type.name}
            entityTypeNamespace={entityType.type.namespace}
            updateFn={this.updateEntityType}
            editingPermissions={false} />

        <div className={styles.spacerMed} />
        <div className={styles.entityTypeLabel}>Source Entity Types</div>
        <EntityTypeOverviewList
            entityTypes={this.state.srcEntityTypes} />


        <div className={styles.entityTypeLabel}>Destination Entity Types</div>
        <EntityTypeOverviewList
            entityTypes={this.state.dstEntityTypes} />


        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default AssociationType;
