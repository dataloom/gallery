import React, { PropTypes } from 'react';

import {
  EntityDataModelApi,
  SearchApi
} from 'loom-data';

import StringConsts from '../../../../utils/Consts/StringConsts';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
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
    entityTypes: PropTypes.array,
    updateFn: PropTypes.func
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
  //
  // newEntityType = () => {
  //   this.setState({ newEntityTypeRow: true });
  // }

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
    // needs backend updates
  }

  deleteEntityType = (entityType) => {
    // needs backend updates
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
          searchFn={SearchApi.searchPropertyTypesByFQN}
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

    // TODO once backend updates are in place for adding/removing entity types, update this
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
            {entityTypeList}
          </tbody>
        </table>
        <div className={this.state.error.display}>Unable to {this.state.error.action} entity type.</div>
      </div>
    );
  }
}

export default EntityTypeOverviewList;
