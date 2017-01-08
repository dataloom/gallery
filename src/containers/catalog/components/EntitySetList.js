import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../utils/Utils';
import AuthService from '../../../utils/AuthService';
import { NewEdmObjectInput } from '../../../components/edminput/NewEdmObjectInput';
import { EntitySet } from './EntitySet';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import styles from '../catalog.module.css';

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
      allTypeNamespaces: {}
    };
  }

  /* API Calls */
  componentDidMount() {
    this.updateFn();
  }

  updateFn = () => {
    Promise.join(
      EntityDataModelApi.getAllEntitySets(),
      EntityDataModelApi.getAllEntityTypes(),
      (entitySets, entityTypes) => {
        const allTypeNamespaces = {};
        entityTypes.forEach((type) => {
          if (allTypeNamespaces[type.namespace] === undefined) {
            allTypeNamespaces[type.namespace] = [type.name];
          }
          else {
            allTypeNamespaces[type.namespace].push(type.name);
          }
        });
        this.setState({
          entitySets: Utils.addKeysToArray(entitySets),
          allTypeNamespaces,
          loadEntitySetsError: false
        });
      }
    ).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  };

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

  /* Component */
  errorClass = {
    true: styles.error,
    false: styles.hidden
  }

  renderCreateEntitySet = () => {
    if (!this.context.isAdmin) return null;
    return (
      <NewEdmObjectInput
        createSuccess={this.newEntitySetSuccess}
        namespaces={this.state.allTypeNamespaces}
        edmType={EdmConsts.ENTITY_SET_TITLE}
      />
    );
  }

  render() {
    const { entitySets, loadEntitySetsError } = this.state;
    const entitySetList = entitySets.map((entitySet) => {
      return (<EntitySet
        key={entitySet.key}
        name={entitySet.entitySet.name}
        title={entitySet.entitySet.title}
        type={entitySet.entitySet.type}
        isOwner={entitySet.isOwner}
      />);
    });
    return (
      <div className={styles.entitySetList}>
        {this.renderCreateEntitySet()}
        <div className={this.errorClass[loadEntitySetsError]}>Unable to load entity sets.</div>
        {entitySetList}
      </div>
    );
  }
}

export default EntitySetList;
