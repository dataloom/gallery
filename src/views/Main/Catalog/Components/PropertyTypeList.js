import React, { PropTypes } from 'react';
import { PropertyType } from './PropertyType';

export class PropertyTypeList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    propertyTypes: React.PropTypes.string
  }

  keyPropertyTypes(types) {
    const propertyTypes = types;
    propertyTypes.map((type) => {
      const newType = type;
      newType.key = propertyTypes.indexOf(type);
      return newType;
    });
    return propertyTypes;
  }

  tdStyle() {
    return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10' };
  }

  render() {
    const propArray = this.keyPropertyTypes(JSON.parse(this.props.propertyTypes));
    const propertyTypeList = propArray.map((prop) => {
      return (
        <PropertyType key={prop.key} propertyType={prop} />
      );
    });
    return (
      <table style={{ }}>
        <tbody>
          <tr>
            <th style={this.tdStyle()}>Name</th>
            <th style={this.tdStyle()}>Namespace</th>
            <th style={this.tdStyle()}>Datatype</th>
            <th style={this.tdStyle()}>Multiplicity</th>
          </tr>
          {propertyTypeList}
        </tbody>
      </table>
    );
  }
}

export default PropertyTypeList;
