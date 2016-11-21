import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { EntityTypeFqn } from './EntityTypeFqn';
import Consts from '../../../../utils/AppConsts';
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
      error: {
        display: styles.hidden,
        action: Consts.ADD
      }
    };
  }

  addRowClass = {
    true: Consts.EMPTY,
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
        action: Consts.ADD
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
      {
        namespace: this.props.schemaNamespace,
        name: this.props.schemaName
      },
      [{ namespace, name }]
    ).then(() => {
      this.updateFqns();
    }).catch(() => {
      this.updateError(Consts.ADD);
    });
  }

  render() {
    const fqnArray = this.keyPropertyTypes();
    const entityTypeFqnList = fqnArray.map((fqn) => {
      return (<EntityTypeFqn
        key={fqn.key}
        entityTypeFqn={fqn}
        schemaName={this.props.schemaName}
        schemaNamespace={this.props.schemaNamespace}
        updateFn={this.props.updateFn}
        errorFn={this.updateError}
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
              className={this.addRowClass[this.state.newEntityTypeRow]}
              namespaces={this.props.allEntityTypeNamespaces}
              addProperty={this.addEntityTypeToSchema}
            />
          </tbody>
        </table>
        <button onClick={this.newEntityType} className={this.addButtonClass[!this.state.newEntityTypeRow]}>+</button>
        <div className={this.state.error.display}>Unable to {this.state.error.action} entity type.</div>
      </div>
    );
  }
}

export default EntityTypeFqnList;
