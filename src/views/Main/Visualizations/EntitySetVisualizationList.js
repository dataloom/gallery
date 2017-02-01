import React, { PropTypes } from 'react';
import Promise from 'bluebird';
import { AuthorizationApi, EntityDataModelApi, SearchApi } from 'loom-data';
import AsyncContent, { ASYNC_STATUS } from '../../../components/asynccontent/AsyncContent';
import EdmConsts from '../../../utils/Consts/EdmConsts';
import { Permission } from '../../../core/permissions/Permission';
import styles from './styles.module.css';

export class EntitySetVisualizationList extends React.Component {

  static propTypes = {
    displayEntitySetFn: PropTypes.func
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      entitySets: [],
      asyncStatus: ASYNC_STATUS.LOADING
    };
  }

  componentDidMount() {
    this.getEntitySets();
  }

  getEntitySets = () => {
    SearchApi.getPopularEntitySet()
      .then((entitySets) => {
        this.getEntityTypes(entitySets)
        .then((idToEdmObjects) => {
          this.loadVisualizableEntitySets(entitySets, idToEdmObjects.idToEntityType, idToEdmObjects.idToPropertyType);
        });
      }).catch(() => {
        this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
      });
  }

  getEntityTypes = (entitySets) => {
    const uniqueEntityTypeIds = new Set();
    entitySets.forEach((entitySet) => {
      uniqueEntityTypeIds.add(entitySet.entityTypeId);
    });
    return Promise.map(uniqueEntityTypeIds, (id) => {
      return EntityDataModelApi.getEntityType(id);
    }).then((entityTypes) => {
      const idToEntityType = {};
      entityTypes.forEach((entityType) => {
        idToEntityType[entityType.id] = entityType;
      });
      return this.getPropertyTypes(entityTypes).then((idToPropertyType) => {
        return { idToPropertyType, idToEntityType };
      });
    });
  }

  getPropertyTypes = (entityTypes) => {
    const uniquePropertyTypeIds = new Set();
    entityTypes.forEach((entityType) => {
      entityType.properties.forEach((propertyTypeId) => {
        uniquePropertyTypeIds.add(propertyTypeId);
      });
    });
    return Promise.map((uniquePropertyTypeIds), (id) => {
      return EntityDataModelApi.getPropertyType(id);
    }).then((propertyTypes) => {
      const idToPropertyType = {};
      propertyTypes.forEach((propertyType) => {
        idToPropertyType[propertyType.id] = propertyType;
      });
      return idToPropertyType;
    });
  }

  checkWhetherToDisplayEntitySet = (entitySet, idToEntityType, idToPropertyType) => {
    const accessChecks = [];
    idToEntityType[entitySet.entityTypeId].properties.forEach((propertyId) => {
      if (EdmConsts.EDM_NUMBER_TYPES.includes(idToPropertyType[propertyId].datatype)) {
        accessChecks.push({
          aclKey: [entitySet.id, propertyId],
          permissions: [Permission.READ.name]
        });
      }
    });

    return AuthorizationApi.checkAuthorizations(accessChecks)
    .then((authorizedProperties) => {
      const visualizableProperties = authorizedProperties.filter((property) => {
        return property.permissions.READ;
      });
      return (visualizableProperties.length > 1) ? entitySet : null;
    });
  }

  loadVisualizableEntitySets = (entitySets, idToEntityType, idToPropertyType) => {
    const entitySetPromises = entitySets.map((entitySet) => {
      return this.checkWhetherToDisplayEntitySet(entitySet, idToEntityType, idToPropertyType);
    });
    Promise.all(entitySetPromises).then((allEntitySetsResults) => {
      const visualizableEntitySets = allEntitySetsResults.filter((entitySet) => {
        return entitySet;
      });
      this.setState({
        entitySets: visualizableEntitySets,
        asyncStatus: ASYNC_STATUS.SUCCESS
      });
    });
  }

  renderEntitySetList = () => {
    const entitySetList = (this.state.entitySets.length === 0) ?
      <p>You do not have access to any visualizable entity sets.</p> :
      this.state.entitySets.map((entitySet) => {
        return (
          <button
              onClick={() => {
                this.props.displayEntitySetFn(entitySet.id);
              }}
              className={styles.listItemButton}
              key={entitySet.id} >
            <div className={styles.entitySetTitle}>{entitySet.title}</div>
            <div className={styles.entitySetFqn}>{entitySet.description}</div>
          </button>
        );
      });
    return (<div>{entitySetList}</div>);
  }

  render() {
    return (
      <AsyncContent
          status={this.state.asyncStatus}
          errorMessage="Unable to load entity sets."
          content={this.renderEntitySetList} />
    );
  }
}

export default EntitySetVisualizationList;
