import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { EntityTypeFqn } from './EntityTypeFqn';
import CatalogApi from '../../../../utils/CatalogApi';
import Utils from '../../../../utils/Utils';

export class EntityTypeFqnList extends React.Component {
  static propTypes = {
    entityTypeFqns: PropTypes.array,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string,
    updateFn: PropTypes.func
  }

  constructor() {
    super();
    this.state = {
      newEntityTypeRow: false,
      error: false
    };
  }

  addRowClassName = {
    true: 'showAddEntityType',
    false: 'hideAddEntityType'
  }

  showErrorMsgClass = {
    true: 'errorMsg',
    false: 'hiddenErrorMsg'
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
    const name = document.getElementById('nameField').value;
    const namespace = document.getElementById('namespaceField').value;
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
      <EntityTypeFqn key={fqn.key} entityTypeFqn={fqn} />
    );
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th className={'tableCell'}>Name</th>
              <th className={'tableCell'}>Namespace</th>
            </tr>
            {entityTypeFqnList}
            <tr className={this.addRowClassName[this.state.newEntityTypeRow]}>
              <td><input type="text" id="nameField" placeholder="name" className={'tableCell'} /></td>
              <td><input type="text" id="namespaceField" placeholder="namespace" className={'tableCell'} /></td>
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
