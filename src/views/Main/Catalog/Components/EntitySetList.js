import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import AuthService from '../../../../utils/AuthService';
import { EntitySet } from './EntitySet';
import styles from '../styles.module.css';

export class EntitySetList extends React.Component {
  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entitySets: [],
      error: false
    };
  }

  errorClass = {
    true: styles.error,
    false: styles.hidden
  }

  componentDidMount() {
    EntityDataModelApi.getAllEntitySets()
      .then((entitySets) => {
        this.setState({ entitySets: Utils.addKeysToArray(entitySets) });
      }).catch(() => {
        this.setState({ error: true });
      });
  }

  render() {
    const entitySetList = this.state.entitySets.map((entitySet) => {
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
      <div>
        <div className={styles.spacerBig} />
        <div className={this.errorClass[this.state.error]}>Unable to load entity sets.</div>
        {entitySetList}
      </div>
    );
  }
}

export default EntitySetList;
