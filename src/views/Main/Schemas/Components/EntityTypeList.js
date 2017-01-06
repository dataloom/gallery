import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import Utils from '../../../../utils/Utils';
import { EntityType } from './EntityType';
import { NewEdmObjectInput } from '../../../../components/edminput/NewEdmObjectInput';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import styles from '../styles.module.css';

export class EntityTypeList extends React.Component {

  static contextTypes = {
    isAdmin: PropTypes.bool
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entityTypes: [],
      loadTypesError: false,
      allPropNamespaces: {}
    };
  }

  componentDidMount() {
    this.updateFn();
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  newEntityTypeSuccess = () => {
    EntityDataModelApi.getAllEntityTypes()
      .then((entityTypes) => {
        this.setState({
          entityTypes: Utils.addKeysToArray(entityTypes),
          loadTypesError: false,
          createTypeError: false
        });
      }).catch(() => {
        this.setState({ loadTypesError: true });
      });
  }

  updateFn = () => {
    Promise.join(
      EntityDataModelApi.getAllEntityTypes(),
      EntityDataModelApi.getAllPropertyTypes(),
      (entityTypes, propertyTypes) => {
        const allPropNamespaces = {};
        propertyTypes.forEach((prop) => {
          if (allPropNamespaces[prop.namespace] === undefined) {
            allPropNamespaces[prop.namespace] = [prop.name];
          }
          else {
            allPropNamespaces[prop.namespace].push(prop.name);
          }
        });
        this.setState({
          entityTypes: Utils.addKeysToArray(entityTypes),
          allPropNamespaces,
          loadTypesError: false
        });
      }
    ).catch(() => {
      this.setState({ loadTypesError: true });
    });
  }

  renderCreateEntityType = () => {
    if (!this.context.isAdmin) return null;
    return (
      <NewEdmObjectInput
        namespaces={this.state.allPropNamespaces}
        createSuccess={this.newEntityTypeSuccess}
        edmType={EdmConsts.ENTITY_TYPE_TITLE}
      />
    );
  }

  render() {
    const { entityTypes, allPropNamespaces, loadTypesError } = this.state;

    const entityTypeList = entityTypes.map((entityType) => {
      return (<EntityType
        key={entityType.key}
        name={entityType.name}
        namespace={entityType.namespace}
        properties={entityType.properties}
        primaryKey={entityType.primaryKey}
        updateFn={this.updateFn}
        allPropNamespaces={allPropNamespaces}
      />);
    });

    return (
      <div>
        <div className={styles.edmContainer}>
          {this.renderCreateEntityType()}
        </div>
        <div className={this.errorClass[loadTypesError]}>Unable to load entity types.</div>
        {entityTypeList}
      </div>
    );
  }
}

export default EntityTypeList;
