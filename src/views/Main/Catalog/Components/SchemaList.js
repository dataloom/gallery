import React, { PropTypes } from 'react';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';
import { Schema } from './Schema';
import '../styles.module.css';

export class SchemaList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    schemas: React.PropTypes.array
  }

  constructor(props, context) {
    super(props, context);
    this.state = { schemas: [] };
  }

  componentDidMount() {
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
        propertyTypes={JSON.stringify(schema.propertyTypes)}
        entityTypeFqns={JSON.stringify(schema.entityTypeFqns)}
      />
    );
    return (<div>{schemaList}</div>);
  }
}

export default SchemaList;
