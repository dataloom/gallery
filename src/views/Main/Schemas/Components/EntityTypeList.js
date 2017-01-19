import React, { PropTypes } from 'react';
import { Promise } from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
import { EntityType } from './EntityType';
import { NewEdmObjectInput } from './NewEdmObjectInput';
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
          entityTypes,
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
        if (propertyTypes.length > 0) {
          propertyTypes.forEach((prop) => {
            const propObj = {
              name: prop.type.name,
              id: prop.id
            };
            if (allPropNamespaces[prop.type.namespace] === undefined) {
              allPropNamespaces[prop.type.namespace] = [propObj];
            }
            else {
              allPropNamespaces[prop.type.namespace].push(propObj);
            }
          });
        }
        this.setState({
          entityTypes,
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
        key={entityType.id}
        entityType={entityType}
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
