import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { EntityTypeFqn } from './EntityTypeFqn';
import StringConsts from '../../../../utils/Consts/StringConsts';
import PermissionsConsts from '../../../../utils/Consts/PermissionConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import Utils from '../../../../utils/Utils';
import styles from '../styles.module.css';

export class EntityTypeFqnList extends React.Component {
  static propTypes = {
    entityTypeFqns: PropTypes.array,
    schemaName: PropTypes.string,
    schemaNamespace: PropTypes.string,
    updateFn: PropTypes.func,
    allEntityTypeNamespaces: PropTypes.object
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor() {
    super();
    this.state = {
      newEntityTypeRow: false,
      error: {
        display: styles.hidden,
        action: PermissionsConsts.ADD
      }
    };
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
    this.props.updateFn();
    this.setState({
      newEntityTypeRow: false,
      error: {
        display: styles.hidden,
        action: PermissionsConsts.ADD
      }
    });
  }

  updateError = (action) => {
    this.setState({
      error: {
        display: styles.errorMsg,
        action
      }
    });
  }

  addEntityTypeToSchema = (namespace, name) => {
    EntityDataModelApi.addEntityTypesToSchema(
      Utils.getFqnObj(this.props.schemaNamespace, this.props.schemaName),
      [Utils.getFqnObj(namespace, name)]
    ).then(() => {
      this.updateFqns();
    }).catch(() => {
      this.updateError(PermissionsConsts.ADD);
    });
  }

  renderAddNewRowButton = () => {
    if (!this.context.isAdmin) return null;
    const className = (this.state.newEntityTypeRow) ? styles.hidden : styles.addButton;
    return (
      <button onClick={this.newEntityType} className={className}>+</button>
    );
  }

  renderNewRowInput = () => {
    const { allEntityTypeNamespaces, entityTypeFqns } = this.props;
    if (!this.context.isAdmin) return null;
    const className = (this.state.newEntityTypeRow) ? StringConsts.EMPTY : styles.hidden;
    return (
      <NameNamespaceAutosuggest
        className={className}
        namespaces={allEntityTypeNamespaces}
        usedProperties={entityTypeFqns}
        addProperty={this.addEntityTypeToSchema}
      />
    );
  }

  render() {
    const { schemaName, schemaNamespace, updateFn } = this.props;
    const fqnArray = this.keyPropertyTypes();
    const entityTypeFqnList = fqnArray.map((fqn) => {
      return (
        <EntityTypeFqn
          key={fqn.key}
          entityTypeFqn={fqn}
          schemaName={schemaName}
          schemaNamespace={schemaNamespace}
          updateFn={updateFn}
          errorFn={this.updateError}
        />
      );
    });
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={styles.tableCell}>Entity Type Name</th>
              <th className={styles.tableCell}>Entity Type Namespace</th>
            </tr>
            {entityTypeFqnList}
            {this.renderNewRowInput()}
          </tbody>
        </table>
        {this.renderAddNewRowButton()}
        <div className={this.state.error.display}>Unable to {this.state.error.action} entity type.</div>
      </div>
    );
  }
}

export default EntityTypeFqnList;
