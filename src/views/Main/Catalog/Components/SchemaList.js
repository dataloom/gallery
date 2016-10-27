import React from 'react';
import { Button } from 'react-bootstrap';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';
import Consts from '../../../../utils/AppConsts';
import styles from '../styles.module.css';

export class SchemaList extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      schemas: [],
      newSchema: false,
      error: false,
      allPropNamespaces: {},
      allEntityTypeNamespaces: {}
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  showNewSchema = {
    true: Consts.EMPTY,
    false: styles.hidden
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newSchema = () => {
    this.setState({ newSchema: true });
  }

  newSchemaSuccess = () => {
    document.getElementById('newSchemaName').value = Consts.EMPTY;
    document.getElementById('newSchemaNamespace').value = Consts.EMPTY;
    EntityDataModelApi.getAllSchemas()
      .then((schemas) => {
        this.setState({
          schemas: Utils.addKeysToArray(schemas),
          newSchema: false
        });
      });
  }

  showError = () => {
    this.setState({ error: true });
  }

  createNewSchema = () => {
    const name = document.getElementById('newSchemaName').value;
    const namespace = document.getElementById('newSchemaNamespace').value;
    EntityDataModelApi.createSchema({ namespace, name })
    .then(() => {
      this.newSchemaSuccess();
    }).catch(() => {
      this.showError();
    });
  }

  updateFn = () => {
    Promise.join(
      EntityDataModelApi.getAllSchemas(),
      EntityDataModelApi.getAllPropertyTypes(),
      EntityDataModelApi.getAllEntityTypes(),
      (schemas, propertyTypes, entityTypes) => {
        const allPropNamespaces = {};
        const allEntityTypeNamespaces = {};
        propertyTypes.forEach((prop) => {
          if (allPropNamespaces[prop.namespace] === undefined) {
            allPropNamespaces[prop.namespace] = [prop.name];
          }
          else {
            allPropNamespaces[prop.namespace].push(prop.name);
          }
        });
        entityTypes.forEach((entityType) => {
          if (allEntityTypeNamespaces[entityType.namespace] === undefined) {
            allEntityTypeNamespaces[entityType.namespace] = [entityType.name];
          }
          else {
            allEntityTypeNamespaces[entityType.namespace].push(entityType.name);
          }
        });

        this.setState({
          schemas: Utils.addKeysToArray(schemas),
          allPropNamespaces,
          allEntityTypeNamespaces
        });
      });
  }

  render() {
    const schemaList = this.state.schemas.map((schema) => {
      return (<Schema
        key={schema.key}
        id={schema.key}
        name={schema.name}
        namespace={schema.namespace}
        propertyTypes={schema.propertyTypes}
        entityTypeFqns={schema.entityTypeFqns}
        jsonContents={schema}
        updateFn={this.updateFn}
        allPropNamespaces={this.state.allPropNamespaces}
        allEntityTypeNamespaces={this.state.allEntityTypeNamespaces}
      />);
    });
    return (
      <div>
        <div className={styles.edmContainer}>
          <Button
            onClick={this.newSchema}
            className={this.showNewSchema[!this.state.newSchema]}
          >Create a new schema
          </Button>
          <div className={this.showNewSchema[this.state.newSchema]}>
            <div>Schema Name:</div>
            <input id="newSchemaName" className={styles.inputBox} type="text" placeholder="name" />
            <div className={styles.spacerSmall} />
            <div>Schema Namespace:</div>
            <input id="newSchemaNamespace" className={styles.inputBox} type="text" placeholder="namespace" />
            <div className={styles.spacerSmall} />
            <Button onClick={this.createNewSchema}>Create</Button>
          </div>
          <div className={this.errorClass[this.state.error]}>Unable to create schema.</div>
        </div>
        {schemaList}
      </div>
    );
  }
}

export default SchemaList;
