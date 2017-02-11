import React from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import Promise from 'bluebird';
import { EntityDataModelApi } from 'loom-data';
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
      newRow: true,
      editingPropertyType: '',
      editingEntitySets: [],
      needsTwoEntitySetsError: false
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
    const availablePropertyTypes = this.state.availablePropertyTypes;
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
      return <div className={styles.error}>You must specify two or more entity sets to link on.</div>
    }
  }

  renderChooseLinks = () => {
    if (this.state.selectedEntitySetIds.length < 2) return null;
    return (
      <div className={styles.linkSelection}>
        <div className={styles.explanationText}>Choose property types to link.</div>
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
        needsTwoEntitySetsError: false
      });
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
    });
  }

  onEntitySetAdded = (options) => {
    const selectedEntitySetIds = options.map((option) => {
      return option.value;
    });
    this.setState({ selectedEntitySetIds });
    this.loadPropertyTypesForSelectedEntitySets(selectedEntitySetIds);
  }

  renderChooseEntitySets = () => {
    const entitySetOptions = this.state.allEntitySets.map((entitySet) => {
      return ({ label: entitySet.name, value: entitySet.id });
    });
    return (
      <div>
        <div className={styles.explanationText}>Choose entity sets to link.</div>
        <Select
            value={this.state.selectedEntitySetIds}
            options={entitySetOptions}
            multi
            onChange={this.onEntitySetAdded} />
      </div>
    );
  }

  renderLinkButton = () => {
    if (this.state.selectedEntitySetIds.length > 1 && this.state.links.length >= 1) {
      return (
        <Button bsStyle="primary" onClick={this.performLink} className={styles.linkButton}>Link</Button>
      );
    }
    return null;
  }

  performLink = () => {
    console.log('~~~~linking~~~~');
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Link</Page.Title>
        </Page.Header>
        <Page.Body>
          {this.renderChooseEntitySets()}
          {this.renderChooseLinks()}
          {this.renderLinkButton()}
        </Page.Body>
      </Page>
    );
  }
}

export default Link;
