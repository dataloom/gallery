import React, { PropTypes } from 'react';

export class Property extends React.Component {
  static propTypes = {
    property: PropTypes.object,
    primaryKey: PropTypes.bool
  }

  isPrimaryKey() {
    const pKey = this.props.primaryKey;
    if (pKey) {
      return (<td className={'primaryKey'}>(primary key)</td>);
    }
    return null;
  }

  render() {
    const prop = this.props.property;
    return (
      <tr className={'tableRows'}>
        <td className={'tableCell'}>{prop.name}</td>
        <td className={'tableCell'}>{prop.namespace}</td>
        {this.isPrimaryKey()}
      </tr>
    );
  }
}

export default Property;
