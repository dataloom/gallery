import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../utils/Utils';
import PermissionsConsts from '../../../utils/Consts/PermissionsConsts';
import styles from './styles.module.css';

export class EntitySetVisualizationList extends React.Component {

  static propTypes = {
    displayEntitySetFn: PropTypes.func
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
        const entitySetsWithPermissions = Utils.addKeysToArray(entitySets.filter((entitySet) => {
          const acls = entitySet.permissions;
          return (acls.includes(PermissionsConsts.READ) || acls.includes(PermissionsConsts.WRITE));
        }));
        this.setState({
          entitySets: entitySetsWithPermissions,
          error: false
        });
      }).catch(() => {
        this.setState({ error: true });
      });
  }

  render() {
    const entitySetList = this.state.entitySets.map((entitySet) => {
      const set = entitySet.entitySet;
      return (
        <button
          onClick={() => {
            this.props.displayEntitySetFn(set.name, set.type.namespace, set.type.name);
          }}
          className={styles.listItemButton}
          key={set.name}
        >
          <div className={styles.entitySetName}>{set.name} ({set.type.namespace}.{set.type.name})</div>
          <div className={styles.entitySetTitle}>{set.title}</div>
        </button>
      );
    });
    return (
      <div>
        <div className={styles.spacerBig} />
        <h1>Choose an entity set to visualize.</h1>
        <div className={this.errorClass[this.state.error]}>Unable to load entity sets.</div>
        {entitySetList}
      </div>
    );
  }
}

export default EntitySetVisualizationList;
