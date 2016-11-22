import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { EntityTypeFqn } from './EntityTypeFqn';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
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
      error: false
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

  showErrorMsgClass = {
    true: styles.errorMsg,
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
    this.setState({ newEntityTypeRow: false });
  }

  updateError = () => {
    this.setState({ error: true });
  }

  addEntityTypeToSchema = (namespace, name) => {
    EntityDataModelApi.addEntityTypesToSchema(
      {
        namespace: this.props.schemaNamespace,
        name: this.props.schemaName
      },
      [{ namespace, name }]
    ).then(() => {
      this.updateFqns();
    }).catch(() => {
      this.updateError();
    });
  }

  render() {
    const { schemaName, schemaNamespace, updateFn, allEntityTypeNamespaces } = this.props;
    const { newEntityTypeRow, error } = this.state;
    const fqnArray = this.keyPropertyTypes();
    const entityTypeFqnList = fqnArray.map((fqn) => {
      return (<EntityTypeFqn
        key={fqn.key}
        entityTypeFqn={fqn}
        schemaName={schemaName}
        schemaNamespace={schemaNamespace}
        updateFn={updateFn}
      />);
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
              addProperty={this.addEntityTypeToSchema}
            />
          </tbody>
        </table>
        <button onClick={this.newEntityType} className={this.addButtonClass[!newEntityTypeRow]}>+</button>
        <div className={this.showErrorMsgClass[error]}>Unable to add entity type.</div>
      </div>
    );
  }
}

export default EntityTypeFqnList;
