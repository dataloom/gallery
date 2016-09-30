import React, { PropTypes } from 'react';

export class EntityTypeFqn extends React.Component {
  static propTypes = {
    entityTypeFqn: PropTypes.object
  }

  render() {
    const fqn = this.props.entityTypeFqn;
    return (
      <tr className={'tableRows'}>
        <td className={'tableCell'}>{fqn.name}</td>
        <td className={'tableCell'}>{fqn.namespace}</td>
      </tr>
    );
  }
}

export default EntityTypeFqn;
