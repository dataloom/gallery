import React from 'react';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';

export class SchemaList extends React.Component {
  static propTypes = {
    schemas: React.PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = { schemas: [] };
  }

  componentDidMount() {
    this.updateFn();
  }

  updateFn = () => {
    CatalogApi.getCatalogSchemaData()
      .then((schemas) => {
        this.setState({ schemas: Utils.addKeysToArray(schemas) });
      });
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
    return (<div>{schemaList}</div>);
  }
}

export default SchemaList;
