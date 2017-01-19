import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { Promise } from 'bluebird';
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
        schemas,
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
        console.log(schemas);
        const allPropNamespaces = {};
        const allEntityTypeNamespaces = {};
        if (propertyTypes.length > 0) {
          propertyTypes.forEach((prop) => {
            const propObj = {
              name: prop.type.name,
              id: prop.id
            };
            if (allPropNamespaces[prop.type.namespace] === undefined) {
              allPropNamespaces[prop.type.namespace] = [propObj];
            }
            else {
              allPropNamespaces[prop.type.namespace].push(propObj);
            }
          });
        }
        if (entityTypes.length > 0) {
          entityTypes.forEach((entityType) => {
            const typeObj = {
              name: entityType.type.name,
              id: entityType.id
            };
            if (allEntityTypeNamespaces[entityType.type.namespace] === undefined) {
              allEntityTypeNamespaces[entityType.type.namespace] = [typeObj];
            }
            else {
              allEntityTypeNamespaces[entityType.type.namespace].push(typeObj);
            }
          });
        }

        this.setState({
          schemas,
          allPropNamespaces,
          allEntityTypeNamespaces,
          loadSchemasError: false
        });
      }
    ).catch(() => {
      this.setState({ loadSchemasError: true });
    });
  }

  renderCreateNewSchema = () => {
    if (!this.context.isAdmin) return null;
    return <NewEdmObjectInput createSuccess={this.newSchemaSuccess} edmType={EdmConsts.SCHEMA_TITLE} />;
  }

  render() {
    const {
      schemas,
      allPropNamespaces,
      allEntityTypeNamespaces,
      loadSchemasError
    } = this.state;
    const schemaList = schemas.map((schema) => {
      console.log(schema);
      return (<Schema
        key={`${schema.fqn.namespace}.${schema.fqn.name}`}
        schema={schema}
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
