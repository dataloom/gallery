import React, { PropTypes } from 'react';
import { EntityTypeFqn } from './EntityTypeFqn';

export class EntityTypeFqnList extends React.Component {
  static propTypes = {
    entityTypeFqns: PropTypes.array
  }

  keyPropertyTypes() {
    const entityTypeFqns = this.props.entityTypeFqns.map((fqn) => {
      const newFqn = fqn;
      newFqn.key = this.props.entityTypeFqns.indexOf(fqn);
      return newFqn;
    });
    return entityTypeFqns;
  }

  render() {
    const fqnArray = this.keyPropertyTypes();
    const entityTypeFqnList = fqnArray.map(fqn =>
      <EntityTypeFqn key={fqn.key} entityTypeFqn={fqn} />
    );
    return (
      <table>
        <tbody>
          <tr>
            <th className={'tableCell'}>Name</th>
            <th className={'tableCell'}>Namespace</th>
          </tr>
          {entityTypeFqnList}
        </tbody>
      </table>
    );
  }
}

export default EntityTypeFqnList;
