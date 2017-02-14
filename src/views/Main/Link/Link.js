import React from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import Promise from 'bluebird';
import { EntityDataModelApi, LinkingApi } from 'loom-data';
import DefineLinkedEntityType from './DefineLinkedEntityType';
import Page from '../../../components/page/Page';
import buttonStyles from '../../../core/styles/buttons.css';
import styles from './styles.module.css';

export class Link extends React.Component {

  constructor() {
    super();
    this.state = {
      allEntitySets: [],
      selectedEntitySetIds: [],
      availablePropertyTypes: {},
      links: [],
      entityTypeIdToEntitySet: {},
      propertyTypeIdToEntityType: {},
      newRow: false,
      editingPropertyType: '',
      editingEntitySets: [],
      needsTwoEntitySetsError: false,
      loadEntitySetsError: false,
      linkingError: false,
      linkingSuccess: false,
      chooseLinks: false,
      chooseLinkedEntityType: false
    };
  }

  componentDidMount() {
    this.loadAllEntitySets();
  }

  loadAllEntitySets = () => {
    EntityDataModelApi.getAllEntitySets()
    .then((allEntitySets) => {
      const entityTypeIdToEntitySet = {};
      allEntitySets.forEach((entitySet) => {
        if (entityTypeIdToEntitySet[entitySet.entityTypeId]) {
          entityTypeIdToEntitySet[entitySet.entityTypeId].push(entitySet);
        }
        else {
          entityTypeIdToEntitySet[entitySet.entityTypeId] = [entitySet];
        }
      });
      this.setState({ allEntitySets, entityTypeIdToEntitySet });
    }).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  }

  renderExistingLinks = () => {
    return this.state.links.map((link) => {
      let entitySetsString = '';
      if (link.entitySets.length >= 1) {
        entitySetsString = link.entitySets[0].name;
      }
      if (link.entitySets.length > 1) {
        for (let i = 1; i < link.entitySets.length; i += 1) {
          entitySetsString = entitySetsString.concat(', ').concat(link.entitySets[i].name);
        }
      }
      return (
        <tr key={link.propertyType.id}>
          <td>
            <button
                className={buttonStyles.deleteButton}
                onClick={() => {
                  this.removeLink(link.propertyType.id);
                }}>-</button>
          </td>
          <td className={`${styles.propertyTypeSelect} ${styles.linkBox}`}>{link.propertyType.title}</td>
          <td className={`${styles.entitySetsSelect} ${styles.linkBox}`}>{entitySetsString}</td>
        </tr>
      );
    });
  }

  addRow = () => {
    this.setState({ newRow: true });
  }

  removeLink = (propertyTypeId) => {
    const links = this.state.links.filter((link) => {
      return link.propertyType.id !== propertyTypeId;
    });
    this.setState({ links });
  }

  renderAddRowButton = () => {
    if (this.state.newRow) return null;
    return (
      <tr>
        <td>
          <button className={buttonStyles.addButton} onClick={this.addRow}>+</button>
        </td>
      </tr>
    );
  }

  onPropertyTypeLinkChange = (e) => {
    const editingPropertyType = (e && e.value) ? e.value : '';
    this.setState({
      editingPropertyType,
      editingEntitySets: [],
      needsTwoEntitySetsError: false
    });
  }

  onEntitySetsLinkChange = (options) => {
    const editingEntitySets = options.map((option) => {
      return option.value;
    });
    this.setState({ editingEntitySets });
  }

  getPropertyTypeOptions() {
    const availablePropertyTypes = Object.assign({}, this.state.availablePropertyTypes);
    this.state.links.forEach((link) => {
      delete availablePropertyTypes[link.propertyType.id];
    });
    return Object.values(availablePropertyTypes).map((propertyType) => {
      return { label: propertyType.title, value: propertyType.id };
    });
  }

  getEntitySetsOptions = () => {
    const entitySetOptions = [];
    if (this.state.editingPropertyType && this.state.editingPropertyType.length > 0) {
      const entityTypes = this.state.propertyTypeIdToEntityType[this.state.editingPropertyType];
      entityTypes.forEach((entityType) => {
        const entitySets = this.state.entityTypeIdToEntitySet[entityType.id];
        entitySets.forEach((entitySet) => {
          if (this.state.selectedEntitySetIds.includes(entitySet.id)) {
            entitySetOptions.push({ label: entitySet.name, value: entitySet.id });
          }
        });
      });
    }
    return entitySetOptions;
  }

  saveLink = () => {
    if (this.state.editingEntitySets.length < 2) {
      this.setState({ needsTwoEntitySetsError: true });
      return;
    }
    const propertyType = this.state.availablePropertyTypes[this.state.editingPropertyType];
    const entitySets = this.state.allEntitySets.filter((entitySet) => {
      return this.state.editingEntitySets.includes(entitySet.id);
    });
    const links = this.state.links;
    links.push({ propertyType, entitySets });
    this.setState({
      links,
      newRow: false,
      editingPropertyType: '',
      editingEntitySets: [],
      needsTwoEntitySetsError: false
    });
  }

  renderNewLink = () => {
    if (this.state.newRow) {
      return (
        <tr>
          <td />
          <td>
            <Select
                className={styles.propertyTypeSelect}
                options={this.getPropertyTypeOptions()}
                value={this.state.editingPropertyType}
                onChange={this.onPropertyTypeLinkChange} />
          </td>
          <td>
            <Select
                className={styles.entitySetsSelect}
                options={this.getEntitySetsOptions()}
                value={this.state.editingEntitySets}
                onChange={this.onEntitySetsLinkChange}
                multi />
          </td>
          <td>
            <Button bsStyle="info" onClick={this.saveLink} className={styles.spacerLeft}>Add links</Button>
          </td>
        </tr>
      );
    }
    return null;
  }

  renderNotEnoughEntitySetsError = () => {
    if (this.state.needsTwoEntitySetsError) {
      return <div className={styles.error}>You must specify two or more entity sets to link on.</div>;
    }
    return null;
  }

  chooseLinks = () => {
    this.setState({
      chooseLinks: true,
      newRow: true
    });
  }

  renderChooseLinksButton = () => {
    if (this.state.selectedEntitySetIds.length < 2 || this.state.chooseLinks) return null;
    return (
      <div className={styles.createEntityTypeButtonContainer}>
        <Button
            bsStyle="primary"
            onClick={this.chooseLinks}
            className={styles.createEntityTypeButton}>
          {'Define the links to join the entity sets'}</Button>
      </div>
    );
  }

  renderChooseLinks = () => {
    if (!this.state.chooseLinks) return null;
    return (
      <div className={styles.linkSelection}>
        <div className={styles.explanationText}>Step 2. Choose property types to link.</div>
        <table className={styles.linkTable}>
          <tbody>
            <tr>
              <th />
              <th>Property Type</th>
              <th>Entity Sets</th>
            </tr>
            {this.renderExistingLinks()}
            {this.renderNewLink()}
            {this.renderAddRowButton()}
          </tbody>
        </table>
        {this.renderNotEnoughEntitySetsError()}
      </div>
    );
  }

  loadPropertyTypes = (entityTypes) => {
    const propertyTypeIdToEntityType = {};
    const propertyTypeIds = new Set();
    entityTypes.forEach((entityType) => {
      entityType.properties.forEach((propertyTypeId) => {
        propertyTypeIds.add(propertyTypeId);
        if (propertyTypeIdToEntityType[propertyTypeId]) {
          propertyTypeIdToEntityType[propertyTypeId].push(entityType);
        }
        else {
          propertyTypeIdToEntityType[propertyTypeId] = [entityType];
        }
      });
    });
    Promise.map(propertyTypeIds, (propertyTypeId) => {
      return EntityDataModelApi.getPropertyType(propertyTypeId);
    }).then((propertyTypes) => {
      const availablePropertyTypes = {};
      propertyTypes.forEach((propertyType) => {
        availablePropertyTypes[propertyType.id] = propertyType;
      });
      this.setState({
        availablePropertyTypes,
        propertyTypeIdToEntityType,
        editingPropertyType: '',
        editingEntitySets: [],
        links: [],
        newRow: true,
        needsTwoEntitySetsError: false,
        loadEntitySetsError: false
      });
    }).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  }

  loadPropertyTypesForSelectedEntitySets = (selectedEntitySetIds) => {
    const entityTypeIds = new Set();
    selectedEntitySetIds.forEach((entitySetId) => {
      const entitySet = this.state.allEntitySets.filter((entitySetObj) => {
        return entitySetObj.id === entitySetId;
      })[0];
      entityTypeIds.add(entitySet.entityTypeId);
    });
    Promise.map(entityTypeIds, (entityTypeId) => {
      return EntityDataModelApi.getEntityType(entityTypeId);
    }).then((entityTypes) => {
      this.loadPropertyTypes(entityTypes);
    }).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  }

  onSelectedEntitySetChange = (options) => {
    const selectedEntitySetIds = options.map((option) => {
      return option.value;
    });
    const chooseLinks = (selectedEntitySetIds.length < 2) ? false : this.state.chooseLinks;
    this.setState({
      selectedEntitySetIds,
      chooseLinks,
      chooseLinkedEntityType: false
    });
    this.loadPropertyTypesForSelectedEntitySets(selectedEntitySetIds);
  }

  renderLoadEntitySetsError = () => {
    if (this.state.loadEntitySetsError) {
      return (<div className={styles.error}>Unable to load entity sets.</div>);
    }
    return null;
  }

  renderChooseEntitySets = () => {
    const entitySetOptions = this.state.allEntitySets.map((entitySet) => {
      return ({ label: entitySet.name, value: entitySet.id });
    });
    return (
      <div>
        <div className={styles.explanationText}>Step 1. Choose entity sets to link.</div>
        <Select
            value={this.state.selectedEntitySetIds}
            options={entitySetOptions}
            multi
            onChange={this.onSelectedEntitySetChange} />
        {this.renderLoadEntitySetsError()}
      </div>
    );
  }

  renderDefineLinkedEntityTypeButton = () => {
    if (this.state.selectedEntitySetIds.length > 1
      && this.state.links.length >= 1
      && !this.state.chooseLinkedEntityType) {
      return (
        <div className={styles.createEntityTypeButtonContainer}>
          <Button
              bsStyle="primary"
              onClick={this.chooseLinkedEntityType}
              className={styles.createEntityTypeButton}>
            {'Define the linked entity type to create'}</Button>
        </div>
      );
    }
    return null;
  }

  renderDefineLinkedEntityType = () => {
    const linkedProps = this.state.links.map((link) => {
      return link.propertyType.id;
    });
    if (this.state.chooseLinkedEntityType) {
      return (
        <DefineLinkedEntityType
            linkedProps={linkedProps}
            availablePropertyTypes={this.state.availablePropertyTypes}
            linkFn={this.createLinkingEntityType} />
      );
    }
    return null;
  }

  chooseLinkedEntityType = () => {
    this.setState({ chooseLinkedEntityType: true });
  }

  performLink = (linkingEntityTypeId) => {
    const linkingProperties = this.state.links.map((link) => {
      const propertyMap = {};
      link.entitySets.forEach((entitySet) => {
        propertyMap[entitySet.id] = link.propertyType.id;
      });
      return propertyMap;
    });
    LinkingApi.linkEntitySets(linkingProperties, linkingEntityTypeId)
    .then(() => {
      this.setState({
        linkingSuccess: true,
        linkingError: false
      });
    }).catch(() => {
      this.setState({
        linkingError: true,
        linkingSuccess: false
      });
    });
  }

  createLinkingEntityType = (entityType) => {
    const entityTypeIds = [];
    this.state.allEntitySets.forEach((entitySet) => {
      if (this.state.selectedEntitySetIds.includes(entitySet.id)) {
        entityTypeIds.push(entitySet.entityTypeId);
      }
    });
    LinkingApi.createLinkingEntityType({ entityType, entityTypeIds })
    .then((linkingEntityTypeId) => {
      this.performLink(linkingEntityTypeId);
    }).catch(() => {
      this.setState({
        linkingError: true,
        linkingSuccess: false
      });
    });
  }

  renderLinkingStatus = () => {
    if (this.state.linkingSuccess) {
      return <div className={styles.success}>Success! Your linked entity set is being created.</div>;
    }
    else if (this.state.linkingError) {
      return <div className={styles.error}>Unable to link entity sets.</div>;
    }
    return null;
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Link</Page.Title>
        </Page.Header>
        <Page.Body>
          {this.renderChooseEntitySets()}
          {this.renderChooseLinksButton()}
          {this.renderChooseLinks()}
          {this.renderDefineLinkedEntityTypeButton()}
          {this.renderDefineLinkedEntityType()}
          {this.renderLinkingStatus()}
        </Page.Body>
      </Page>
    );
  }
}

export default Link;
