import React, { PropTypes } from 'react';

export class PropertyType extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    propertyType: PropTypes.object
  }

  tdStyle(row) {
    console.log()
    if (row%2 == 0) {
      return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#e3e3e3' };
    } else {
      return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#f1f1f1' };
    }
  }

  render() {
    const prop = this.props.propertyType;
    return (
      <tr>
        <td style={this.tdStyle(prop.key)}>{prop.name}</td>
        <td style={this.tdStyle(prop.key)}>{prop.namespace}</td>
        <td style={this.tdStyle(prop.key)}>{prop.datatype}</td>
        <td style={this.tdStyle(prop.key)}>{prop.multiplicity}</td>
      </tr>
    );
  }
}

export default PropertyType;
