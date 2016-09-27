import React, { PropTypes } from 'react';

export class EntityTypeFqn extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    entityTypeFqn: PropTypes.object
  }

  tdStyle(row) {
    if (row % 2 === 0) {
      return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#e3e3e3' };
    }
    return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10', backgroundColor: '#f1f1f1' };
  }

  render() {
    const fqn = this.props.entityTypeFqn;
    return (
      <tr>
        <td style={this.tdStyle(fqn.key)}>{fqn.name}</td>
        <td style={this.tdStyle(fqn.key)}>{fqn.namespace}</td>
      </tr>
    );
  }
}

export default EntityTypeFqn;
