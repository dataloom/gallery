import React, { PropTypes } from 'react';
import Select from 'react-select';
import DocumentTitle from 'react-document-title';
import Promise from 'bluebird';

import {
  Button
} from 'react-bootstrap';

import {
  EntityDataModelApi,
  LinkingApi
} from 'loom-data';

import AuthService from '../../../utils/AuthService';
import DefineLinkedEntityType from './DefineLinkedEntityType';
import DefineLinkedEntitySet from './DefineLinkedEntitySet';
import Page from '../../../components/page/Page';
import DeleteButton from '../../../components/buttons/DeleteButton';
import AddButton from '../../../components/buttons/AddButton';
import LoadingSpinner from '../../../components/asynccontent/LoadingSpinner';
import styles from './styles.module.css';

export class Link extends React.Component {

  static propTypes = {
    auth: PropTypes.instanceOf(AuthService)
  }

  constructor(props) {
    super(props);
    this.state = {
      allEntitySets: [],
      selectedEntitySets: [],
      availablePropertyTypes: {},
      links: [],
      entityTypeIdToEntitySet: {},
      propertyTypeIdToEntityType: {},
      newRow: false,
      editingPropertyType: '',
      editingEntitySets: [],
      needsOneEntitySetError: false,
      loadEntitySetsError: false,
      linkingError: false,
      linkingSuccess: false,
      chooseLinks: false,
      chooseLinkedEntityType: false,
      entityTypeCreated: false,
      linkingEntityTypeId: '',
      isLinking: false,
      defineLinkedEntityTypeError: false,
      createLinkedEntitySetError: false,
      titleValue: '',
      namespaceValue: '',
      nameValue: '',
      descriptionValue: ''
    };
  }

  componentDidMount() {
    this.loadAllEntitySets();
  }

  loadAllEntitySets = () => {
    EntityDataModelApi.getAllEntitySets()
    .then((allEntitySetsRaw) => {
      const entityTypeIdToEntitySet = {};
      const allEntitySets = allEntitySetsRaw.filter(entitySet => entitySet);
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

  addRow = () => {
    this.setState({ newRow: true });
  }

  onPropertyTypeLinkChange = (e) => {
    const editingPropertyType = (e && e.value) ? e.value : '';
    this.setState({
      editingPropertyType,
      editingEntitySets: [],
      needsOneEntitySetError: false
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
      this.state.selectedEntitySets.forEach((entitySet) => {
        entitySetOptions.push(entitySet);
      });
    }
    return entitySetOptions;
  }

  saveLink = () => {
    if (this.state.editingEntitySets.length < 1) {
      this.setState({ needsOneEntitySetError: true });
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
      needsOneEntitySetError: false
    });
  }

  renderNotEnoughEntitySetsError = () => {
    if (this.state.needsOneEntitySetError) {
      return <div className={styles.error}>You must specify an entity set to link on.</div>;
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
    if (this.state.selectedEntitySets.length < 1 || this.state.chooseLinks) return null;
    return (
      <div className={styles.createEntityTypeButtonContainer}>
        <Button
            bsStyle="primary"
            onClick={this.chooseLinks}
            className={styles.entitySetsButton}>
          {'Confirm linked entity sets'}</Button>
      </div>
    );
  }


  removeLink = (propertyTypeId) => {
    const links = this.state.links.filter((link) => {
      return link.propertyType.id !== propertyTypeId;
    });
    this.setState({ links });
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
            <DeleteButton
                onClick={() => {
                  this.removeLink(link.propertyType.id);
                }} />
          </td>
          <td className={`${styles.propertyTypeSelect} ${styles.linkBox}`}>{link.propertyType.title}</td>
          <td className={`${styles.entitySetsSelect} ${styles.linkBox}`}>{entitySetsString}</td>
        </tr>
      );
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

  renderAddRowButton = () => {
    if (this.state.newRow) return null;
    return (
      <tr>
        <td>
          <AddButton onClick={this.addRow} />
        </td>
      </tr>
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

  loadPropertyTypes = (entityType) => {
    const propertyTypeIdToEntityType = {};
    entityType.properties.forEach((propertyTypeId) => {
      if (propertyTypeIdToEntityType[propertyTypeId]) {
        propertyTypeIdToEntityType[propertyTypeId].push(entityType);
      }
      else {
        propertyTypeIdToEntityType[propertyTypeId] = [entityType];
      }
    });
    Promise.map(entityType.properties, (propertyTypeId) => {
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
        needsOneEntitySetError: false,
        loadEntitySetsError: false
      });
    }).catch(() => {
      this.setState({ loadEntitySetsError: true });
    });
  }

  loadPropertyTypesForSelectedEntitySets = (selectedEntitySets) => {
    if (selectedEntitySets.length) {
      EntityDataModelApi.getEntityType(selectedEntitySets[0].entityTypeId)
      .then((entityType) => {
        this.loadPropertyTypes(entityType);
      }).catch(() => {
        this.setState({ loadEntitySetsError: true });
      });
    }
  }

  onSelectedEntitySetChange = (selectedEntitySets) => {
    const chooseLinks = (selectedEntitySets.length < 1) ? false : this.state.chooseLinks;
    this.setState({
      selectedEntitySets,
      chooseLinks,
      chooseLinkedEntityType: false
    });
    this.loadPropertyTypesForSelectedEntitySets(selectedEntitySets);
  }

  renderLoadEntitySetsError = () => {
    if (this.state.loadEntitySetsError) {
      return (<div className={styles.error}>Unable to load entity sets.</div>);
    }
    return null;
  }

  renderChooseEntitySets = () => {
    const entitySetOptions = [];
    this.state.allEntitySets.forEach((entitySet) => {
      if (!this.state.selectedEntitySets.length ||
        entitySet.entityTypeId === this.state.selectedEntitySets[0].entityTypeId) {
        entitySetOptions.push({
          label: entitySet.name,
          value: entitySet.id,
          entityTypeId: entitySet.entityTypeId,
          id: entitySet.id
        });
      }
    });
    const selectedEntitySetIds = this.state.selectedEntitySets.map((selectedEntitySet) => {
      return selectedEntitySet.id;
    });
    return (
      <div className={styles.step1Wrapper}>
        <div className={styles.explanationText}>Step 1. Choose entity sets to link.</div>
        <Select
            value={selectedEntitySetIds}
            options={entitySetOptions}
            multi
            onChange={this.onSelectedEntitySetChange} />
        {this.renderLoadEntitySetsError()}
      </div>
    );
  }

  renderDefineLinkedEntityTypeButton = () => {
    if (this.state.selectedEntitySets.length > 0
      && this.state.links.length >= 1
      && !this.state.chooseLinkedEntityType) {
      return (
        <div className={styles.createEntityTypeButtonContainer}>
          <Button
              bsStyle="primary"
              onClick={this.chooseLinkedEntityType}
              className={styles.propertyTypesButton}>
            {'Confirm property links'}</Button>
        </div>
      );
    }
    return null;
  }

  renderDefineLinkedEntityType = () => {
    if (this.state.chooseLinkedEntityType) {
      const entityTypeFormData = {
        namespace: this.state.namespaceValue,
        name: this.state.nameValue,
        title: this.state.titleValue,
        description: this.state.descriptionValue
      };
      return (
        <DefineLinkedEntityType
            availablePropertyTypes={this.state.availablePropertyTypes}
            linkFn={this.createLinkingEntityType}
            formData={entityTypeFormData}
            handleNamespaceChange={this.handleNamespaceChange}
            handleNameChange={this.handleNameChange}
            handleTitleChange={this.handleTitleChange}
            handleDescriptionChange={this.handleDescriptionChange} />
      );
    }
    return null;
  }

  chooseLinkedEntityType = () => {
    this.setState({ chooseLinkedEntityType: true });
  }

  performLink = (name, title, description, contacts) => {
    this.setState({ isLinking: true });
    const entitySet = {
      name,
      title,
      description,
      contacts,
      entityTypeId: this.state.linkingEntityTypeId
    };
    const linkingProperties = this.state.links.map((link) => {
      const propertyMap = {};
      link.entitySets.forEach((linkEntitySet) => {
        propertyMap[linkEntitySet.id] = link.propertyType.id;
      });
      return propertyMap;
    });
    const linkingEntitySet = { entitySet, linkingProperties };
    LinkingApi.linkEntitySets(linkingEntitySet)
    .then(() => {
      this.setState({
        linkingSuccess: true,
        linkingError: false,
        isLinking: false,
        createLinkedEntitySetError: false
      });
    }).catch(() => {
      this.setState({
        linkingError: true,
        linkingSuccess: false,
        isLinking: false,
        createLinkedEntitySetError: true
      });
    });
  }

  createLinkingEntityType = (entityType, deidentified) => {
    let entityTypeIds = new Set();
    this.state.allEntitySets.forEach((entitySet) => {
      this.state.selectedEntitySets.forEach((selectedEntitySet) => {
        if (selectedEntitySet.id === entitySet.id) entityTypeIds.add(entitySet.entityTypeId);
      });
    });
    entityTypeIds = Array.from(entityTypeIds);
    LinkingApi.createLinkingEntityType({ entityType, entityTypeIds, deidentified })
    .then((linkingEntityTypeId) => {
      if (linkingEntityTypeId) {
        this.setState({
          entityTypeCreated: true,
          deidentified,
          linkingEntityTypeId,
          defineLinkedEntityTypeError: false
        });
      }
      else {
        this.setState({
          entityTypeCreated: false,
          linkingError: true,
          linkingSuccess: false
        });
      }
    }).catch(() => {
      this.setState({
        entityTypeCreated: false,
        linkingError: true,
        linkingSuccess: false,
        defineLinkedEntityTypeError: true
      });
    });
  }

  getDefaultContact = () => {
    const profile = this.props.auth.getProfile();
    let defaultContact = '';
    if (profile.given_name) defaultContact = defaultContact.concat(`${profile.given_name} `);
    if (profile.family_name) defaultContact = defaultContact.concat(`${profile.family_name} `);
    if (profile.email) defaultContact = defaultContact.concat(`<${profile.email}>`);
    return defaultContact;
  }

  renderDefineLinkedEntityTypeError = () => {
    return this.state.defineLinkedEntityTypeError
        ? <div className={styles.error}>An error occurred. Check that the Namespace + Name combination is unique.</div>
        : null;
  }

  handleNamespaceChange = (e) => {
    this.setState({ namespaceValue: e.target.value });
  }

  handleNameChange = (e) => {
    this.setState({ nameValue: e.target.value });
  }

  handleTitleChange = (e) => {
    this.setState({ titleValue: e.target.value });
  }

  handleDescriptionChange = (e) => {
    this.setState({ descriptionValue: e.target.value });
  }

  render() {
    let content;
    if (this.state.isLinking) {
      content = <LoadingSpinner />;
    }
    else if (this.state.linkingSuccess) {
      content = <div className={styles.linkingSuccessMsg}>Success! Your linked entity set is being created.</div>;
    }
    else if (this.state.entityTypeCreated) {
      const formData = {
        namespace: this.state.namespace,
        name: this.state.nameValue,
        title: this.state.titleValue,
        description: this.state.descriptionValue
      };
      content = (<DefineLinkedEntitySet
          linkFn={this.performLink}
          createLinkedEntitySetError={this.state.createLinkedEntitySetError}
          defaultContact={this.getDefaultContact()}
          formData={formData} />);
    }
    else {
      content = (
        <div className={styles.contentWrapper}>
          {this.renderChooseEntitySets()}
          {this.renderChooseLinksButton()}
          {this.renderChooseLinks()}
          {this.renderDefineLinkedEntityTypeButton()}
          {this.renderDefineLinkedEntityType()}
          {this.renderDefineLinkedEntityTypeError()}
        </div>
      );
    }
    return (
      <DocumentTitle title="Link">
        <Page>
          <Page.Header>
            <Page.Title>Link</Page.Title>
            <div className={styles.headerLink}><a href="https://help.thedataloom.com/guides/linking/" target="_blank">Click here for instructions</a></div>
          </Page.Header>
          <Page.Body>
            {content}
          </Page.Body>
        </Page>
      </DocumentTitle>
    );
  }
}

export default Link;
