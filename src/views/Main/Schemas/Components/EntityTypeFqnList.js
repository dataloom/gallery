import React, { PropTypes } from 'react';

import {
  EntityDataModelApi,
  SearchApi
} from 'lattice';

import StringConsts from '../../../../utils/Consts/StringConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import AddButton from '../../../../components/buttons/AddButton';
import styles from '../styles.module.css';

import {
  EntityTypeFqn
} from './EntityTypeFqn';

import {
  NameNamespaceAutosuggest
} from './NameNamespaceAutosuggest';

export class EntityTypeFqnList extends React.Component {
  static propTypes = {
    entityTypeFqns: PropTypes.array,
    updateSchemaFn: PropTypes.func
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
    EntityDataModelApi.getEntityTypeId({ namespace, name })
    .then((entityTypeId) => {
      this.props.updateSchemaFn([entityTypeId], ActionConsts.ADD, EdmConsts.ENTITY_TYPE);
      this.updateFqns();
    }).catch(() => {
      this.updateError();
    });
  }

  renderAddNewRowButton = () => {
    if (!this.context.isAdmin || this.state.newEntityTypeRow) return null;
    return <AddButton onClick={this.newEntityType} />;
  }

  renderNewRowInput = () => {
    const entityTypeFqns = this.props.entityTypeFqns;
    if (!this.context.isAdmin) return null;
    const className = (this.state.newEntityTypeRow) ? StringConsts.EMPTY : styles.hidden;
    return (
      <NameNamespaceAutosuggest
          searchFn={SearchApi.searchEntityTypesByFQN}
          className={className}
          usedProperties={entityTypeFqns}
          addProperty={this.addEntityTypeToSchema} />
    );
  }

  render() {
    const { entityTypeFqns, updateSchemaFn } = this.props;
    const entityTypeFqnList = entityTypeFqns.map((fqn) => {
      return (
        <EntityTypeFqn
            key={fqn.id}
            entityTypeFqn={fqn}
            updateSchemaFn={updateSchemaFn} />
      );
    });
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <th />
              <th className={styles.tableCell}>Entity Type Namespace</th>
              <th className={styles.tableCell}>Entity Type Name</th>
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
