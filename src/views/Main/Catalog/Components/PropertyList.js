import React, { PropTypes } from 'react';
import { Property } from './Property';

export class PropertyList extends React.Component {
  static propTypes = {
    properties: PropTypes.array,
    primaryKey: PropTypes.array
  }

  keyProperties() {
    const properties = this.props.properties;
    for (const prop of properties) {
      const newProp = prop;
      newProp.key = properties.indexOf(prop);
    }
    return properties;
  }

  render() {
    const propArray = this.keyProperties();
    const pKeyJson = this.props.primaryKey;
    const propertyList = propArray.map((prop) => {
      const primaryKey = (pKeyJson[0].name === prop.name && pKeyJson[0].namespace === prop.namespace);
      return (
        <Property key={prop.key} property={prop} primaryKey={primaryKey} />
      );
    });
    return (
      <table>
        <tbody>
          <tr>
            <th className={'tableCell'}>Name</th>
            <th className={'tableCell'}>Namespace</th>
          </tr>
          {propertyList}
        </tbody>
      </table>
    );
  }
}

export default PropertyList;
