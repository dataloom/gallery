import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import AuthService from '../../../../utils/AuthService';
import { NewEntitySet } from './NewEntitySet';
import { EntitySet } from './EntitySet';
import styles from '../styles.module.css';

export class EntitySetList extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entitySets: [],
      loadEntitySetsError: false,
      entityTypes: []
    };
  }

  errorClass = {
    true: styles.error,
    false: styles.hidden
  }

  componentDidMount() {
    this.updateFn();
  }

  updateFn = () => {
    Promise.join(
      EntityDataModelApi.getAllEntitySets(),
      EntityDataModelApi.getAllEntityTypes(),
      (entitySets, entityTypes) => {
        this.setState({
          entitySets: Utils.addKeysToArray(entitySets),
          entityTypes,
          loadEntitySetsError: false
        });
      }
    ).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  }

  newEntitySetSuccess = () => {
    EntityDataModelApi.getAllEntitySets().then((entitySets) => {
      this.setState({
        entitySets: Utils.addKeysToArray(entitySets),
        loadEntitySetsError: false
      });
    }).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  }

  renderCreateEntitySet = () => {
    if (!this.context.isAdmin) return null;
    return <NewEntitySet createSuccess={this.newEntitySetSuccess} allTypes={this.state.entityTypes} />;
  }

  render() {
    const { entitySets, loadEntitySetsError } = this.state;
    const entitySetList = entitySets.map((entitySet) => {
      return (<EntitySet
        key={entitySet.key}
        name={entitySet.entitySet.name}
        title={entitySet.entitySet.title}
        type={entitySet.entitySet.type}
        permissions={entitySet.permissions}
        isOwner={entitySet.isOwner}
        auth={this.props.auth}
      />);
    });
    return (
      <div className={styles.edmContainer}>
        {this.renderCreateEntitySet()}
        <div className={this.errorClass[loadEntitySetsError]}>Unable to load entity sets.</div>
        {entitySetList}
      </div>
    );
  }
}

export default EntitySetList;
