import React, { PropTypes } from 'react';
import { Property } from './Property';

export class PropertyList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    properties: PropTypes.string,
    primaryKey: PropTypes.string
  }

  keyProperties() {
    const properties = JSON.parse(this.props.properties);
    properties.map((prop) => {
      const newProp = prop;
      newProp.key = properties.indexOf(prop);
      return newProp;
    });
    return properties;
  }

  render() {
    const propArray = this.keyProperties();
    const pKeyJson = JSON.parse(this.props.primaryKey);
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
