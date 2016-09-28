import React, { PropTypes } from 'react';
import { PropertyType } from './PropertyType';
import '../styles.module.css';

export class PropertyTypeList extends React.Component {
  static propTypes = {
    propertyTypes: PropTypes.string
  }

  keyPropertyTypes() {
    const propertyTypes = JSON.parse(this.props.propertyTypes);
    propertyTypes.map((type) => {
      const newType = type;
      newType.key = propertyTypes.indexOf(type);
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
