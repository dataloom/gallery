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

  keyProperties(props) {
    const properties = props;
    properties.map((prop) => {
      const newProp = prop;
      newProp.key = properties.indexOf(prop);
      return newProp;
    });
    return properties;
  }

  tdStyle() {
    return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10' };
  }

  render() {
    const propArray = this.keyProperties(JSON.parse(this.props.properties));
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
            <th style={this.tdStyle()}>Name</th>
            <th style={this.tdStyle()}>Namespace</th>
          </tr>
          {propertyList}
        </tbody>
      </table>
    );
  }
}

export default PropertyList;
