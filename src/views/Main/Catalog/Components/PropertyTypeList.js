import React, { PropTypes } from 'react';
import { PropertyType } from './PropertyType';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.array
  }

  keyPropertyTypes() {
    const propertyTypes = this.props.propertyTypes.map((type) => {
      const newType = type;
      newType.key = this.props.propertyTypes.indexOf(type);
      return newType;
    });
    return propertyTypes;
  }

  render() {
    const propArray = this.keyPropertyTypes();
    const propertyTypeList = propArray.map(prop =>
      <PropertyType key={prop.key} propertyType={prop} />
    );
    return (
      <table>
        <tbody>
          <tr>
            <th className={'tableCell'}>Name</th>
            <th className={'tableCell'}>Namespace</th>
            <th className={'tableCell'}>Datatype</th>
            <th className={'tableCell'}>Multiplicity</th>
          </tr>
          {propertyTypeList}
        </tbody>
      </table>
    );
  }
}

export default PropertyTypeList;
