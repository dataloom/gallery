import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
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
      error: false
    };
  }

  addRowClassName = {
    true: Consts.EMPTY,
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
    const fqnArray = this.keyPropertyTypes();
    const entityTypeFqnList = fqnArray.map((fqn) => {
      return (<EntityTypeFqn
        key={fqn.key}
        entityTypeFqn={fqn}
        schemaName={this.props.schemaName}
        schemaNamespace={this.props.schemaNamespace}
        updateFn={this.props.updateFn}
      />);
    });
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={styles.tableCell}>Name</th>
              <th className={styles.tableCell}>Namespace</th>
            </tr>
            {entityTypeFqnList}
            <NameNamespaceAutosuggest
              className={this.addRowClassName[this.state.newEntityTypeRow]}
              namespaces={this.props.allEntityTypeNamespaces}
              addProperty={this.addEntityTypeToSchema}
            />
          </tbody>
        </table>
        <Button onClick={this.newEntityType} className={this.addRowClassName[!this.state.newEntityTypeRow]}>+</Button>
        <div className={this.showErrorMsgClass[this.state.error]}>Unable to add entity type.</div>
      </div>
    );
  }
}

export default EntityTypeFqnList;
