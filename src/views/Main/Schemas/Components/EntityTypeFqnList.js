import React, { PropTypes } from 'react';
import { EntityTypeFqn } from './EntityTypeFqn';
import StringConsts from '../../../../utils/Consts/StringConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
import Utils from '../../../../utils/Utils';
import styles from '../styles.module.css';

export class EntityTypeFqnList extends React.Component {
  static propTypes = {
    entityTypeFqns: PropTypes.array,
    updateSchemaFn: PropTypes.func,
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
        action: ActionConsts.ADD
      }
    };
  }

  newEntityType = () => {
    this.setState({ newEntityTypeRow: true });
  }

  updateFqns = () => {
    this.setState({
      newEntityTypeRow: false,
      error: {
        display: styles.hidden,
        action: ActionConsts.ADD
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
    const entityTypeIdList = this.props.allEntityTypeNamespaces[namespace].filter((typeObj) => {
      return (typeObj.name === name);
    });
    if (entityTypeIdList.length !== 1) {
      this.updateError();
      return;
    }
    const entityTypeId = entityTypeIdList[0].id;
    this.props.updateSchemaFn([entityTypeId], ActionConsts.ADD, EdmConsts.ENTITY_TYPE);
    this.updateFqns();
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
    const { entityTypeFqns, updateSchemaFn } = this.props;
    const entityTypeFqnList = entityTypeFqns.map((fqn) => {
      return (
        <EntityTypeFqn
          key={fqn.id}
          entityTypeFqn={fqn}
          updateSchemaFn={updateSchemaFn}
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
              <th className={styles.tableCell}>Entity Type Title</th>
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
