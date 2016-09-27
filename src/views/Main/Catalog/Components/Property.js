import React, { PropTypes } from 'react';

export class Property extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    property: PropTypes.object
  }

  tdStyle(row) {
    if (row % 2 === 0) {
      return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#e3e3e3' };
    }
    return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#f1f1f1' };
  }

  render() {
    const prop = this.props.property;
    return (
      <tr>
        <td style={this.tdStyle(prop.key)}>{prop.name}</td>
        <td style={this.tdStyle(prop.key)}>{prop.namespace}</td>
      </tr>
    );
  }
}

export default Property;
