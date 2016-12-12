import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';
import { NewEdmObjectInput } from './NewEdmObjectInput';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';

export class SchemaList extends React.Component {

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      schemas: [],
      loadSchemasError: false,
      allPropNamespaces: {},
      allEntityTypeNamespaces: {}
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newSchemaSuccess = () => {
    EntityDataModelApi.getAllSchemas()
    .then((schemas) => {
      this.setState({
        schemas: Utils.addKeysToArray(schemas),
        loadSchemasError: false
      });
    }).catch(() => {
      this.setState({ loadSchemasError: true });
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
          allEntityTypeNamespaces,
          loadSchemasError: false
        });
      }).catch(() => {
        this.setState({ loadSchemasError: true });
      });
  }

  renderCreateNewSchema = () => {
    if (!this.context.isAdmin) return null;
    return <NewEdmObjectInput createSuccess={this.newSchemaSuccess} edmType={EdmConsts.SCHEMA_TITLE} />;
  }

  render() {
    const { schemas, allPropNamespaces, allEntityTypeNamespaces, loadSchemasError } = this.state;
    const schemaList = schemas.map((schema) => {
      return (<Schema
        key={schema.key}
        name={schema.name}
        namespace={schema.namespace}
        propertyTypes={schema.propertyTypes}
        entityTypeFqns={schema.entityTypeFqns}
        jsonContents={schema}
        updateFn={this.updateFn}
        allPropNamespaces={allPropNamespaces}
        allEntityTypeNamespaces={allEntityTypeNamespaces}
      />);
    });
    return (
      <div>
        <div className={styles.edmContainer}>
          {this.renderCreateNewSchema()}
        </div>
        <div className={this.errorClass[loadSchemasError]}>Unable to load schemas.</div>
        {schemaList}
      </div>
    );
  }
}

export default SchemaList;
