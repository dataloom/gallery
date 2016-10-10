import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';

export class EntityTypeList extends React.Component {
  static propTypes = {
    schemas: PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entityTypes: [],
      newEntityType: false,
      error: false
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  showNewEntityType = {
    true: 'newEntityType',
    false: 'hidden'
  }

  errorClass = {
    false: 'hidden',
    true: 'errorMsg'
  }

  newEntityType = () => {
    this.setState({ newEntityType: true });
  }

  newEntityTypeSuccess = () => {
    document.getElementById('newEntityTypeName').value = '';
    document.getElementById('newEntityTypeNamespace').value = '';
    CatalogApi.getCatalogEntityTypeData()
      .then((entityTypes) => {
        this.setState({
          entityTypes: Utils.addKeysToArray(entityTypes),
          newEntityType: false
        });
      });
  }

  showError = () => {
    this.setState({ error: true });
  }

  createNewEntityType = () => {
    const name = document.getElementById('newEntityTypeName').value;
    const namespace = document.getElementById('newEntityTypeNamespace').value;
    CatalogApi.createNewEntityType(name, namespace, this.newEntityTypeSuccess, this.showError);
  }

  updateFn = () => {
    CatalogApi.getCatalogEntityTypeData()
      .then((entityTypes) => {
        this.setState({ entityTypes: Utils.addKeysToArray(entityTypes) });
      });
  }

  render() {
    const entityTypeList = this.state.entityTypes.map(entityType =>
      <EntityType
        key={entityType.key}
        id={entityType.key}
        name={entityType.name}
        namespace={entityType.namespace}
        properties={entityType.properties}
        primaryKey={entityType.primaryKey}
        updateFn={this.updateFn}
      />
    );
    return (
      <div>
        <div className={'edmContainer'}>
          <Button
            onClick={this.newEntityType}
            className={this.showNewEntityType[!this.state.newEntityType]}
          >Create a new entity type
          </Button>
          <div className={this.showNewEntityType[this.state.newEntityType]}>
            <input
              id="newEntityTypeName"
              style={{ height: '30px' }}
              type="text"
              placeholder="entity type name"
            />
            <div className={'spacerSmall'} />
            <input
              id="newEntityTypeNamespace"
              style={{ height: '30px' }}
              type="text"
              placeholder="entity type namespace"
            />
            <div className={'spacerSmall'} />
            <Button onClick={this.createNewEntityType}>Create</Button>
          </div>
          <div className={this.errorClass[this.state.error]}>Unable to create entity type.</div>
        </div>
        {entityTypeList}
      </div>
    );
  }
}

export default EntityTypeList;
