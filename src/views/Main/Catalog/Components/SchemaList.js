import React from 'react';
import { Button } from 'react-bootstrap';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';

export class SchemaList extends React.Component {
  static propTypes = {
    schemas: React.PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      schemas: [],
      newSchema: false,
      error: false
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  showNewSchema = {
    true: 'newSchema',
    false: 'hidden'
  }

  errorClass = {
    false: 'hidden',
    true: 'errorMsg'
  }

  updateFn = () => {
    CatalogApi.getCatalogSchemaData()
      .then((schemas) => {
        this.setState({ schemas: Utils.addKeysToArray(schemas) });
      });
  }

  newSchema = () => {
    this.setState({ newSchema: true });
  }

  newSchemaSuccess = () => {
    document.getElementById('newSchemaName').value = '';
    document.getElementById('newSchemaNamespace').value = '';
    CatalogApi.getCatalogSchemaData()
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
    CatalogApi.createNewSchema(name, namespace, this.newSchemaSuccess, this.showError);
  }

  render() {
    const schemaList = this.state.schemas.map(schema =>
      <Schema
        key={schema.key}
        name={schema.name}
        namespace={schema.namespace}
        propertyTypes={schema.propertyTypes}
        entityTypeFqns={schema.entityTypeFqns}
        jsonContents={schema}
        updateFn={this.updateFn}
      />
    );
    return (
      <div>
        <div className={'edmContainer'}>
          <Button
            onClick={this.newSchema}
            className={this.showNewSchema[!this.state.newSchema]}
          >Create a new schema
          </Button>
          <div className={this.showNewSchema[this.state.newSchema]}>
            <input id="newSchemaName" style={{ height: '30px' }} type="text" placeholder="schema name" />
            <div className={'spacerSmall'} />
            <input id="newSchemaNamespace" style={{ height: '30px' }} type="text" placeholder="schema namespace" />
            <div className={'spacerSmall'} />
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
