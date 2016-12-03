import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { EntityTypeFqn } from './EntityTypeFqn';
import PermissionsConsts from '../../../../utils/Consts/PermissionsConsts';
import StringConsts from '../../../../utils/Consts/StringConsts';
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

  addRowClass = {
    true: StringConsts.EMPTY,
    false: styles.hidden
  }

  addButtonClass = {
    true: styles.addButton,
    false: styles.hidden
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

  render() {
    const { schemaName, schemaNamespace, updateFn, allEntityTypeNamespaces, entityTypeFqns } = this.props;
    const { newEntityTypeRow, error } = this.state;
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
            <NameNamespaceAutosuggest
              className={this.addRowClass[newEntityTypeRow]}
              namespaces={allEntityTypeNamespaces}
              usedProperties={entityTypeFqns}
              addProperty={this.addEntityTypeToSchema}
            />
          </tbody>
        </table>
        <button onClick={this.newEntityType} className={this.addButtonClass[!newEntityTypeRow]}>+</button>
        <div className={error.display}>Unable to {error.action} entity type.</div>
      </div>
    );
  }
}

export default EntityTypeFqnList;
