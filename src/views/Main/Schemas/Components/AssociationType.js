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
import EdmConsts from '../../../../utils/Consts/EdmConsts';
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
    EntityDataModelApi.getAssociationType(this.props.associationType.entityType.id)
    .then((associationType) => {
      Promise.map(associationType.entityType.properties, (propertyId) => {
        return EntityDataModelApi.getPropertyType(propertyId);
      }).then((properties) => {
        Promise.map(new Set(associationType.src.concat(associationType.dst)), (entityTypeId) => {
          return EntityDataModelApi.getEntityType(entityTypeId);
        }).then((entityTypes) => {
          const entityTypeMap = {};
          entityTypes.forEach((entityType) => {
            entityTypeMap[entityType.id] = entityType;
          });
          const srcEntityTypes = associationType.src.map((id) => {
            return entityTypeMap[id];
          });
          const dstEntityTypes = associationType.dst.map((id) => {
            return entityTypeMap[id];
          });
          this.setState({ properties, srcEntityTypes, dstEntityTypes });
        });
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

  updateAssociationType = (newTypeId, action, field) => {
    let updateFieldFn;
    const id = this.props.associationType.entityType.id;
    if (action === ActionConsts.ADD) {
      if (field === EdmConsts.ASSOCIATION_TYPE_FIELDS.src) {
        updateFieldFn = () => {
          return EntityDataModelApi.addSrcEntityTypeToAssociationType(id, newTypeId);
        };
      }
      else if (field === EdmConsts.ASSOCIATION_TYPE_FIELDS.dst) {
        updateFieldFn = () => {
          return EntityDataModelApi.addDstEntityTypeToAssociationType(id, newTypeId);
        };
      }
    }
    else if (action === ActionConsts.REMOVE) {
      if (field === EdmConsts.ASSOCIATION_TYPE_FIELDS.src) {
        updateFieldFn = () => {
          return EntityDataModelApi.removeSrcEntityTypeFromAssociationType(id, newTypeId);
        };
      }
      else if (field === EdmConsts.ASSOCIATION_TYPE_FIELDS.dst) {
        updateFieldFn = () => {
          return EntityDataModelApi.removeDstEntityTypeFromAssociationType(id, newTypeId);
        };
      }
    }

    if (updateFieldFn) {
      updateFieldFn().then(() => {
        this.updateFn();
      });
    }
  }

  updateAssociationEntityType = (newTypeId, action) => {
    const entityTypeId = this.props.associationType.entityType.id;
    if (action === ActionConsts.ADD) {
      EntityDataModelApi.addPropertyTypeToEntityType(entityTypeId, newTypeId[0])
      .then(() => {
        this.updateFn();
      });
    }
    else if (action === ActionConsts.REMOVE) {
      EntityDataModelApi.removePropertyTypeFromEntityType(entityTypeId, newTypeId[0])
      .then(() => {
        this.updateFn();
      });
    }
  }

  updateAssociationTypeTitle = (title) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.associationType.entityType.id, { title })
    .then(() => {
      this.updateFn();
    });
  }

  updateAssociationTypeDescription = (description) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.associationType.entityType.id, { description })
    .then(() => {
      this.updateFn();
    });
  }

  render() {
    const entityType = this.props.associationType.entityType;
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
            onChange={this.updateAssociationTypeTitle} />
        <InlineEditableControl
            type="textarea"
            size="small"
            placeholder="Association type description..."
            value={entityType.description}
            viewOnly={!this.context.isAdmin}
            onChange={this.updateAssociationTypeDescription} />
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
            updateFn={this.updateAssociationEntityType}
            editingPermissions={false} />

        <div className={styles.spacerMed} />
        <div className={styles.entityTypeLabel}>Source Entity Types</div>
        <EntityTypeOverviewList
            entityTypes={this.state.srcEntityTypes}
            updateFn={this.updateAssociationType}
            field={EdmConsts.ASSOCIATION_TYPE_FIELDS.src} />


        <div className={styles.entityTypeLabel}>Destination Entity Types</div>
        <EntityTypeOverviewList
            entityTypes={this.state.dstEntityTypes}
            updateFn={this.updateAssociationType}
            field={EdmConsts.ASSOCIATION_TYPE_FIELDS.dst} />


        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default AssociationType;
