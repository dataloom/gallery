import React, { PropTypes } from 'react';

export class Property extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool
  }

  tdStyle(row) {
    if (row % 2 === 0) {
      return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#e3e3e3' };
    }
    return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#f1f1f1' };
  }

  isPrimaryKey(prop) {
    const pKey = this.props.primaryKey;
    if (pKey) {
      return (<td style={{ color: 'gray', paddingLeft: '10' }}>(primary key)</td>);
    }
    return null;
  }

  render() {
    const prop = this.props.property;
    return (
      <tr>
        <td style={this.tdStyle(prop.key)}>{prop.name}</td>
        <td style={this.tdStyle(prop.key)}>{prop.namespace}</td>
        {this.isPrimaryKey(prop)}
      </tr>
    );
  }
}

export default Property;
