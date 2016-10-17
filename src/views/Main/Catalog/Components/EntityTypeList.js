import React from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class EntityTypeList extends React.Component {
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
    true: Consts.EMPTY,
    false: Consts.HIDDEN
  }

  errorClass = {
    true: Consts.ERROR,
    false: Consts.HIDDEN
  }

  newEntityType = () => {
    this.setState({ newEntityType: true });
  }

  newEntityTypeSuccess = () => {
    document.getElementById('newEntityTypeName').value = Consts.EMPTY;
    document.getElementById('newEntityTypeNamespace').value = Consts.EMPTY;
    EntityDataModelApi.getEntityTypes()
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
    const pKey = [{
      name: document.getElementById('pKeyName').value,
      namespace: document.getElementById('pKeyNamespace').value
    }];
    EntityDataModelApi.createEntityType({ namespace, name, properties: pKey, key: pKey })
    .then(() => this.newEntityTypeSuccess())
    .catch(() => this.showError());
  }

  updateFn = () => {
    EntityDataModelApi.getEntityTypes()
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
            <div>Entity Type Name:</div>
            <input
              id="newEntityTypeName"
              className={'inputBox'}
              type="text"
              placeholder="name"
            />
            <div className={'spacerSmall'} />
            <div>Entity Type Namespace:</div>
            <input
              id="newEntityTypeNamespace"
              className={'inputBox'}
              type="text"
              placeholder="namespace"
            />
            <div className={'spacerSmall'} />
            <div>Primary Key:</div>
            <table>
              <tbody>
                <tr>
                  <td>
                    <input
                      id="pKeyName"
                      className={'inputBox'}
                      type="text"
                      placeholder="property name"
                    />
                    <input
                      id="pKeyNamespace"
                      className={'inputBox'}
                      type="text"
                      placeholder="property namespace"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
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
