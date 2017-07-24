import React, { PropTypes } from 'react';

import {
  EntityDataModelApi,
  SearchApi
} from 'loom-data';

import StringConsts from '../../../../utils/Consts/StringConsts';
import ActionConsts from '../../../../utils/Consts/ActionConsts';
import AddButton from '../../../../components/buttons/AddButton';
import styles from '../styles.module.css';

import {
  EntityTypeOverview
} from './EntityTypeOverview';

import {
  NameNamespaceAutosuggest
} from './NameNamespaceAutosuggest';

export class EntityTypeOverviewList extends React.Component {
  static propTypes = {
    entityTypes: PropTypes.array.isRequired,
    updateFn: PropTypes.func.isRequired,
    field: PropTypes.string.isRequired
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props) {
    super(props);
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

  addEntityType = (namespace, name) => {
    EntityDataModelApi.getEntityTypeId({ namespace, name })
    .then((id) => {
      this.props.updateFn(id, ActionConsts.ADD, this.props.field);
      this.updateFqns();
    }).catch(() => {
      this.updateError();
    });
  }

  deleteEntityType = (entityType) => {
    this.props.updateFn(entityType.id, ActionConsts.REMOVE, this.props.field);
  }

  renderNewRowButton = () => {
    if (this.context.isAdmin && !this.state.newEntityTypeRow) {
      return <AddButton onClick={this.newEntityType} />;
    }
    return null;
  }

  renderNewRowInput = () => {

    if (!this.context.isAdmin) {
      return null;
    }

    const entityTypeIds = [];
    this.props.entityTypes.forEach((entityType) => {
      if (entityType) {
        entityTypeIds.push(entityType.id);
      }
    });
    const className = (this.state.newEntityTypeRow) ? StringConsts.EMPTY : styles.hidden;
    return (
      <NameNamespaceAutosuggest
          searchFn={SearchApi.searchEntityTypesByFQN}
          className={className}
          usedProperties={entityTypeIds}
          addProperty={this.addEntityType} />
    );
  }

  render() {

    const { entityTypes } = this.props;
    const entityTypeArray = (entityTypes && entityTypes.length > 0) ? entityTypes : [];

    const entityTypeList = [];
    entityTypeArray.forEach((entityType) => {
      if (entityType) {
        entityTypeList.push(
          <EntityTypeOverview
              key={entityType.id}
              entityType={entityType}
              deleteFn={() => {
                this.deleteEntityType(entityType);
              }} />
        );
      }
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
            {entityTypeList}
            {this.renderNewRowInput()}
          </tbody>
        </table>
        {this.renderNewRowButton()}
        <div className={this.state.error.display}>Unable to {this.state.error.action} entity type.</div>
      </div>
    );
  }
}

export default EntityTypeOverviewList;
