import React, { PropTypes } from 'react';
import { EntityTypeFqn } from './EntityTypeFqn';

export class EntityTypeFqnList extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }

  static propTypes = {
    entityTypeFqns: React.PropTypes.string
  }

  keyPropertyTypes(entityTypeFqns) {
    const fqns = entityTypeFqns;
    fqns.map((fqn) => {
      const newFqnObj = fqn;
      newFqnObj.key = entityTypeFqns.indexOf(fqn);
      return newFqnObj;
    });
    return fqns;
  }

  tdStyle() {
    return { paddingTop: '5', paddingBottom: '5', paddingLeft: '10', paddingRight: '10' };
  }

  render() {
    const fqnArray = this.keyPropertyTypes(JSON.parse(this.props.entityTypeFqns));
    const entityTypeFqnList = fqnArray.map((fqn) => {
      return (
        <EntityTypeFqn entityTypeFqn={fqn} />
      );
    });
    return (
      <table>
        <tbody>
          <tr>
            <th style={this.tdStyle()}>Name</th>
            <th style={this.tdStyle()}>Namespace</th>
          </tr>
          {entityTypeFqnList}
        </tbody>
      </table>
    );
  }
}

export default EntityTypeFqnList;
