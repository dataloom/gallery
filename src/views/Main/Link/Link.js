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
} from 'lattice';

import AuthService from '../../../utils/AuthService';
import SelectIncludedFields from './SelectIncludedFields';
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
      loadEntitySetsError: false,
      linkingError: false,
      linkingSuccess: false,
      chooseLinks: false,
      selectFieldsToInclude: false,
      linkingEntityTypeId: '',
      isLinking: false,
      defineLinkedEntityTypeError: false,
      createLinkedEntitySetError: false,
      titleValue: '',
      namespaceValue: '',
      nameValue: '',
      descriptionValue: '',
      selectedFieldIds: []
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

  getPropertyTypeOptions() {
    const availablePropertyTypes = Object.assign({}, this.state.availablePropertyTypes);
    this.state.links.forEach((linkPropertyType) => {
      delete availablePropertyTypes[linkPropertyType.id];
    });
    return Object.values(availablePropertyTypes).map((propertyType) => {
      return { label: propertyType.title, value: propertyType.id };
    });
  }

  saveLink = (e) => {
    if (e && e.value && this.state.availablePropertyTypes[e.value]) {
      const propertyType = this.state.availablePropertyTypes[e.value];
      const links = this.state.links;
      if (links.filter((linkPropertyType) => {
        return linkPropertyType.id === propertyType.id;
      }).length === 0) {
        links.push(propertyType);
      }
      this.setState({
        links,
        newRow: false
      });
    }
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
    const links = this.state.links.filter((linkPropertyType) => {
      return linkPropertyType.id !== propertyTypeId;
    });
    this.setState({ links });
  }

  renderExistingLinks = () => {
    return this.state.links.map((linkPropertyType) => {
      return (
        <tr key={linkPropertyType.id}>
          <td>
            <DeleteButton
                onClick={() => {
                  this.removeLink(linkPropertyType.id);
                }} />
          </td>
          <td className={`${styles.propertyTypeSelect} ${styles.linkBox}`}>{linkPropertyType.title}</td>
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
                onChange={this.saveLink} />
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
            {this.renderExistingLinks()}
            {this.renderNewLink()}
            {this.renderAddRowButton()}
          </tbody>
        </table>
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
        links: [],
        newRow: true,
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
      selectFieldsToInclude: false
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
            closeOnSelect={false}
            multi
            onChange={this.onSelectedEntitySetChange} />
        {this.renderLoadEntitySetsError()}
      </div>
    );
  }

  renderSelectFieldsButton = () => {
    if (this.state.selectedEntitySets.length > 0
      && this.state.links.length >= 1
      && !this.state.selectFieldsToInclude) {
      return (
        <div className={styles.createEntityTypeButtonContainer}>
          <Button
              bsStyle="primary"
              onClick={this.selectFieldsToInclude}
              className={styles.propertyTypesButton}>
            {'Confirm property links'}</Button>
        </div>
      );
    }
    return null;
  }

  renderSelectFields = () => {
    if (this.state.selectFieldsToInclude) {
      return (
        <SelectIncludedFields
            availablePropertyTypes={this.state.availablePropertyTypes}
            selectPropertiesFn={this.confirmSelectedFields} />
      );
    }
    return null;
  }

  selectFieldsToInclude = () => {
    this.setState({ selectFieldsToInclude: true });
  }

  performLink = (name, title, description, contacts) => {
    this.setState({ isLinking: true });
    const entitySet = {
      name,
      title,
      description,
      contacts,
      entityTypeId: this.state.selectedEntitySets[0].entityTypeId
    };
    const linkingProperties = this.state.links.map((linkPropertyType) => {
      const propertyMap = {};
      this.state.selectedEntitySets.forEach((linkEntitySet) => {
        propertyMap[linkEntitySet.id] = linkPropertyType.id;
      });
      return propertyMap;
    });
    const linkingEntitySet = { entitySet, linkingProperties };
    const propertyTypeIds = this.state.selectedFieldIds;
    const linkingRequest = { linkingEntitySet, propertyTypeIds };
    LinkingApi.linkEntitySets(linkingRequest)
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

  confirmSelectedFields = (selectedFieldIds) => {
    this.setState({ selectedFieldIds });
  }

  getDefaultContact = () => {
    const profile = this.props.auth.getProfile();
    let defaultContact = '';
    if (profile.given_name) defaultContact = defaultContact.concat(`${profile.given_name} `);
    if (profile.family_name) defaultContact = defaultContact.concat(`${profile.family_name} `);
    if (profile.email) defaultContact = defaultContact.concat(`<${profile.email}>`);
    return defaultContact;
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
    else if (this.state.selectedFieldIds.length) {
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
          {this.renderSelectFieldsButton()}
          {this.renderSelectFields()}
        </div>
      );
    }
    return (
      <DocumentTitle title="Link">
        <Page>
          <Page.Header>
            <Page.Title>Link</Page.Title>
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
