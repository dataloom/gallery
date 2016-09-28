import React, { PropTypes } from 'react';
import { EntityTypeFqn } from './EntityTypeFqn';
import '../styles.module.css';

export class EntityTypeFqnList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    entityTypeFqns: React.PropTypes.string
  }

  keyPropertyTypes() {
    const entityTypeFqns = JSON.parse(this.props.entityTypeFqns);
    const fqns = entityTypeFqns;
    fqns.map((fqn) => {
      const newFqnObj = fqn;
      newFqnObj.key = entityTypeFqns.indexOf(fqn);
      return newFqnObj;
    });
    return fqns;
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
