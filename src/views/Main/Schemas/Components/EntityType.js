import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import InlineEditableControl from '../../../../components/controls/InlineEditableControl';
import FileService from '../../../../utils/FileService';
import { PropertyList } from './PropertyList';
import { ReorderPropertyList } from './ReorderPropertyList';
import FileConsts from '../../../../utils/Consts/FileConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import styles from '../styles.module.css';

export class EntityType extends React.Component {
  static propTypes = {
    entityType: PropTypes.object,
    idToPropertyTypes: PropTypes.object
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      properties: [],
      isReordering: false
    };
  }

  componentDidMount() {
    this.loadProperties(this.props.entityType.properties);
  }

  componentWillReceiveProps(nextProps) {
    this.loadProperties(nextProps.entityType.properties);
  }

  loadProperties = (propertyIds) => {
    const properties = propertyIds.map((id) => {
      return this.props.idToPropertyTypes[id];
    });
    this.setState({ properties });
  }

  updateFn = () => {
    EntityDataModelApi.getEntityType(this.props.entityType.id)
    .then((entityType) => {
      Promise.map(entityType.properties, (propertyId) => {
        return EntityDataModelApi.getPropertyType(propertyId);
      }).then((properties) => {
        this.setState({ entityType, properties });
      });
    });
  }

  downloadFile = () => {
    const properties = {
      properties: this.state.properties
    };
    const entityType = Object.assign(this.props.entityType, properties);
    FileService.saveFile(entityType, this.props.entityType.title, FileConsts.JSON, this.enableButton);
  }

  updateEntityType = (newTypeUuid, action) => {
    if (action === ActionConsts.ADD) {
      EntityDataModelApi.addPropertyTypeToEntityType(this.props.entityType.id, newTypeUuid[0])
      .then(() => {
        this.updateFn();
      });
    }
    else if (action === ActionConsts.REMOVE) {
      EntityDataModelApi.removePropertyTypeFromEntityType(this.props.entityType.id, newTypeUuid[0])
      .then(() => {
        this.updateFn();
      });
    }
  }

  updateEntityTypeTitle = (title) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.entityType.id, { title })
    .then(() => this.updateFn());
  }

  updateEntityTypeDescription = (description) => {
    EntityDataModelApi.updateEntityTypeMetaData(this.props.entityType.id, { description })
    .then(() => this.updateFn());
  }

  updateEntityTypeFqn = (fqn) => {
    const fqnArray = fqn.split('.');
    if (fqnArray.length !== 2) return Promise.resolve(false);
    return EntityDataModelApi.updateEntityTypeMetaData(this.props.entityType.id, {
      type: {
        namespace: fqnArray[0],
        name: fqnArray[1]
      }
    })
    .then(() => {
      this.updateFn();
      return true;
    })
    .catch(() => {
      this.updateFn();
      return false;
    });
  }

  reorderCallback = (e, movedItem, itemsPreviousIndex, itemsNewIndex, reorderedArray) => {
    const orderedIds = reorderedArray.map((propertyType) => {
      return propertyType.id;
    });
    EntityDataModelApi.reorderPropertyTypesInEntityType(this.props.entityType.id, orderedIds)
    .then(() => this.updateFn());
  }

  renderProperties = () => {
    return (this.state.isReordering && this.context.isAdmin)
      ? <ReorderPropertyList
          properties={this.state.properties}
          reorderCallback={this.reorderCallback} />
      : <PropertyList
          properties={this.state.properties}
          primaryKey={this.props.entityType.key}
          entityTypeName={this.props.entityType.type.name}
          entityTypeNamespace={this.props.entityType.type.namespace}
          updateFn={this.updateEntityType}
          editingPermissions={false} />;
  }

  renderReorderButton = () => {
    if (!this.context.isAdmin) return null;
    const buttonText = (this.state.isReordering) ? 'Done reordering' : 'Reorder';
    return (
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <Button
            bsStyle="default"
            onClick={() => {
              this.setState({ isReordering: !this.state.isReordering });
            }}>{buttonText}</Button>
      </div>
    );
  }

  render() {
    const entityType = this.props.entityType;
    return (
      <div>
        <InlineEditableControl
            type="text"
            size="small"
            placeholder="Entity type full qualified name..."
            value={`${entityType.type.namespace}.${entityType.type.name}`}
            viewOnly={!this.context.isAdmin}
            onChangeConfirm={this.updateEntityTypeFqn} />
        <div className={styles.spacerSmall} />
        <InlineEditableControl
            type="text"
            size="xlarge"
            placeholder="Entity type title..."
            value={entityType.title}
            viewOnly={!this.context.isAdmin}
            onChange={this.updateEntityTypeTitle} />
        <InlineEditableControl
            type="textarea"
            size="small"
            placeholder="Entity type description..."
            value={entityType.description}
            viewOnly={!this.context.isAdmin}
            onChange={this.updateEntityTypeDescription} />
        <div className={styles.spacerSmall} />
        <div className={styles.dropdownButtonContainer}>
          <Button bsStyle="primary" onClick={this.downloadFile}>Download as JSON</Button>
        </div>
        <div className={styles.spacerMed} />
        {this.renderProperties()}
        {this.renderReorderButton()}
        <div className={styles.spacerBig} />
        <hr />
      </div>
    );
  }
}

export default EntityType;
