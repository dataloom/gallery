import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityTypeFqn } from './EntityTypeFqn';
import CatalogApi from '../../../../utils/CatalogApi';

export class EntityTypeFqnList extends React.Component {
  static propTypes = {
    entityTypeFqns: PropTypes.array,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    id: PropTypes.number
  }

  constructor() {
    super();
    this.state = {
      newEntityTypeRow: false,
      error: false
    };
  }

  addRowClassName = {
    true: 'showAddRow',
    false: 'hidden'
  }

  showErrorMsgClass = {
    true: 'errorMsg',
    false: 'hidden'
  }

  keyPropertyTypes() {
    const entityTypeFqns = this.props.entityTypeFqns.map((fqn) => {
      const newFqn = fqn;
      newFqn.key = this.props.entityTypeFqns.indexOf(fqn);
      return newFqn;
    });
    return entityTypeFqns;
  }

  newEntityType = () => {
    this.setState({ newEntityTypeRow: true });
  }

  updateFqns = () => {
    this.setState({ newEntityTypeRow: false });
    this.props.updateFn();
  }

  updateError = () => {
    this.setState({ error: true });
  }

  addEntityTypeToSchema = () => {
    const name = document.getElementById('eName'.concat(this.props.id)).value;
    const namespace = document.getElementById('eSpace'.concat(this.props.id)).value;
    const fqnSet = [{ name, namespace }];
    CatalogApi.addEntityTypeToSchema(
      this.props.schemaNamespace,
      this.props.schemaName,
      fqnSet,
      this.updateFqns,
      this.updateError
    );
  }

  render() {
    const fqnArray = this.keyPropertyTypes();
    const entityTypeFqnList = fqnArray.map(fqn =>
      <EntityTypeFqn
        key={fqn.key}
        entityTypeFqn={fqn}
        schemaName={this.props.schemaName}
        schemaNamespace={this.props.schemaNamespace}
        updateFn={this.props.updateFn}
      />
    );
    const id = this.props.id;
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={'tableCell'}>Name</th>
              <th className={'tableCell'}>Namespace</th>
            </tr>
            {entityTypeFqnList}
            <tr className={this.addRowClassName[this.state.newEntityTypeRow]}>
              <td />
              <td><input type="text" id={'eName'.concat(id)} placeholder="name" className={'tableCell'} /></td>
              <td><input type="text" id={'eSpace'.concat(id)} placeholder="namespace" className={'tableCell'} /></td>
              <td><Button onClick={this.addEntityTypeToSchema}>Save</Button></td>
            </tr>
          </tbody>
        </table>
        <Button onClick={this.newEntityType} className={this.addRowClassName[!this.state.newEntityTypeRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add entity type.</div>
      </div>
    );
  }
}

export default EntityTypeFqnList;
