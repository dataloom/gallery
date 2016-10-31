import React from 'react';
import { Button } from 'react-bootstrap';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';
import Consts from '../../../../utils/AppConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import styles from '../styles.module.css';

export class EntityTypeList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      entityTypes: [],
      newEntityType: false,
      error: false,
      allPropNamespaces: {}
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  showNewEntityType = {
    true: Consts.EMPTY,
    false: styles.hidden
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newEntityType = () => {
    this.setState({ newEntityType: true });
  }

  newEntityTypeSuccess = () => {
    document.getElementById('newEntityTypeName').value = Consts.EMPTY;
    document.getElementById('newEntityTypeNamespace').value = Consts.EMPTY;
    EntityDataModelApi.getAllEntityTypes()
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
    const type = document.getElementById('newEntityTypeName').value;
    const namespace = document.getElementById('newEntityTypeNamespace').value;
    const pKey = [{
      name: document.getElementById(`newName${Consts.PROPERTY_TYPE}0`).firstChild.firstChild.value,
      namespace: document.getElementById(`newNamespace${Consts.PROPERTY_TYPE}0`).firstChild.firstChild.value
    }];
    EntityDataModelApi.createEntityType({ namespace, type, properties: pKey, key: pKey })
    .then(() => {
      this.newEntityTypeSuccess();
    }).catch(() => {
      this.showError();
    });
  }

  updateFn = () => {
    Promise.join(
      EntityDataModelApi.getAllEntityTypes(),
      EntityDataModelApi.getAllPropertyTypes(),
      (entityTypes, propertyTypes) => {
        const allPropNamespaces = {};
        propertyTypes.forEach((prop) => {
          if (allPropNamespaces[prop.namespace] === undefined) {
            allPropNamespaces[prop.namespace] = [prop.name];
          }
          else {
            allPropNamespaces[prop.namespace].push(prop.name);
          }
        });
        this.setState({
          entityTypes: Utils.addKeysToArray(entityTypes),
          allPropNamespaces
        });
      }
    );
  }

  render() {
    const entityTypeList = this.state.entityTypes.map((entityType) => {
      return (<EntityType
        key={entityType.key}
        id={entityType.key}
        name={entityType.name}
        namespace={entityType.namespace}
        properties={entityType.properties}
        primaryKey={entityType.primaryKey}
        updateFn={this.updateFn}
        allPropNamespaces={this.state.allPropNamespaces}
      />);
    });
    return (
      <div>
        <div className={styles.edmContainer}>
          <Button
            onClick={this.newEntityType}
            className={this.showNewEntityType[!this.state.newEntityType]}
          >Create a new entity type
          </Button>
          <div className={this.showNewEntityType[this.state.newEntityType]}>
            <div>Entity Type Name:</div>
            <input
              id="newEntityTypeName"
              className={styles.inputBox}
              type="text"
              placeholder="name"
            />
            <div className={styles.spacerSmall} />
            <div>Entity Type Namespace:</div>
            <input
              id="newEntityTypeNamespace"
              className={styles.inputBox}
              type="text"
              placeholder="namespace"
            />
            <div className={styles.spacerSmall} />
            <div>Primary Key:</div>
            <table>
              <tbody>
                <NameNamespaceAutosuggest
                  id={0}
                  namespaces={this.state.allPropNamespaces}
                  addProperty={this.createNewEntityType}
                  type={Consts.PROPERTY_TYPE}
                  saveOption={false}
                />
              </tbody>
            </table>
            <div className={styles.spacerSmall} />
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
