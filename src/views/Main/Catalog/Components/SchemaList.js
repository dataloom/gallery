import React, { PropTypes } from 'react';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';

export class SchemaList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    schemas: React.PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      schemas: [
        { key: '11', name: 'name1', namespace: 'namespace1', propertyTypes: [] },
        { key: '22', name: 'schema2', namespace: 'namespace2', propertyTypes: [] }
      ]
    };
  }

  componentDidMount() {
    CatalogApi.getCatalogSchemaData()
      .then((schemas) => {
        this.setState({ schemas: Utils.addKeysToArray(schemas) });
      });
  }

  render() {
    const schemaList = this.state.schemas.map((schema) => {
      return (
        <Schema
          key={schema.key}
          name={schema.name}
          namespace={schema.namespace}
          propertyTypes={JSON.stringify(schema.propertyTypes)}
        />
      );
    });
    return (<div>{schemaList}</div>);
  }
}

export default SchemaList;
