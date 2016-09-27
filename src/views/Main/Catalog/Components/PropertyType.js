import React, { PropTypes } from 'react';
import '../styles.module.css';

export class PropertyType extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    propertyType: PropTypes.object
  }

  render() {
    const prop = this.props.propertyType;
    return (
      <tr className={'tableRows'}>
        <td className={'tableCell'}>{prop.name}</td>
        <td className={'tableCell'}>{prop.namespace}</td>
        <td className={'tableCell'}>{prop.datatype}</td>
        <td className={'tableCell'}>{prop.multiplicity}</td>
      </tr>
    );
  }
}

export default PropertyType;
