import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import AuthService from '../../../../utils/AuthService';
import StringConsts from '../../../../utils/Consts/StringConsts';
import { NameNamespaceAutosuggest } from './NameNamespaceAutosuggest';
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
      newEntitySet: false,
      newEntitySetName: StringConsts.EMPTY,
      newEntitySetTitle: StringConsts.EMPTY,
      newEntitySetTypeName: StringConsts.EMTPY,
      newEntitySetTypeNamespace: StringConsts.EMPTY,
      createEntitySetError: false,
      loadEntitySetsError: false,
      allTypeNamespaces: {}
    };
  }

  errorClass = {
    true: styles.error,
    false: styles.hidden
  }

  showNewEntitySetButton = {
    true: styles.genericButton,
    false: styles.hidden
  }

  showNewEntitySet = {
    true: StringConsts.EMPTY,
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
          loadEntitySetsError: false,
          createEntitySetError: false
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
        newEntitySetName: StringConsts.EMPTY,
        newEntitySetTitle: StringConsts.EMPTY,
        newEntitySetTypeName: StringConsts.EMTPY,
        newEntitySetTypeNamespace: StringConsts.EMPTY,
        createEntitySetError: false,
        loadEntitySetsError: false
      });
    }).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  }

  showCreateNewEntitySet = () => {
    this.setState({ newEntitySet: true });
  }

  createNewEntitySet = () => {
    const { newEntitySetName, newEntitySetTitle, newEntitySetTypeName, newEntitySetTypeNamespace } = this.state;
    EntityDataModelApi.createEntitySets([{
      name: newEntitySetName,
      title: newEntitySetTitle,
      type: {
        name: newEntitySetTypeName,
        namespace: newEntitySetTypeNamespace
      }
    }]).then(() => {
      this.newEntitySetSuccess();
    }).catch(() => {
      this.setState({ createEntitySetError: true });
    });
  }

  handleNameChange = (e) => {
    this.setState({ newEntitySetName: e.target.value });
  }

  handleTitleChange = (e) => {
    this.setState({ newEntitySetTitle: e.target.value });
  }

  handleTypeNameChange = (newValue) => {
    this.setState({ newEntitySetTypeName: newValue });
  }

  handleTypeNamespaceChange = (newValue) => {
    this.setState({ newEntitySetTypeNamespace: newValue });
  }

  render() {
    const {
      entitySets,
      newEntitySet,
      newEntitySetName,
      newEntitySetTitle,
      newEntitySetTypeName,
      newEntitySetTypeNamespace,
      createEntitySetError,
      loadEntitySetsError,
      allTypeNamespaces
    } = this.state;
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
        <button
          onClick={this.showCreateNewEntitySet}
          className={this.showNewEntitySetButton[!newEntitySet]}
        >Create a new entity set
        </button>
        <div className={this.showNewEntitySet[newEntitySet]}>
          <div>Entity Set Name:</div>
          <div className={styles.spacerMini} />
          <input
            value={newEntitySetName}
            onChange={this.handleNameChange}
            className={styles.inputBox}
            type="text"
            placeholder="name"
          />
          <div className={styles.spacerSmall} />
          <div>Entity Set Title:</div>
          <div className={styles.spacerMini} />
          <input
            value={newEntitySetTitle}
            onChange={this.handleTitleChange}
            className={styles.inputBox}
            type="text"
            placeholder="title"
          />
          <div className={styles.spacerSmall} />
          <div>Entity Type:</div>
          <div className={styles.spacerMini} />
          <table>
            <tbody>
              <NameNamespaceAutosuggest
                namespaces={allTypeNamespaces}
                usedProperties={[]}
                noSaveButton
                onNameChange={this.handleTypeNameChange}
                onNamespaceChange={this.handleTypeNamespaceChange}
                initialName={newEntitySetTypeName}
                initialNamespace={newEntitySetTypeNamespace}
              />
            </tbody>
          </table>
          <div className={styles.spacerSmall} />
          <button className={styles.genericButton} onClick={this.createNewEntitySet}>Create</button>
        </div>
        <div className={this.errorClass[createEntitySetError]}>Unable to create entity set.</div>
        <div className={styles.spacerBig} />
        <div className={this.errorClass[loadEntitySetsError]}>Unable to load entity sets.</div>
        {entitySetList}
      </div>
    );
  }
}

export default EntitySetList;
