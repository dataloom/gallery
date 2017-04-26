import React, { PropTypes } from 'react';
import Select from 'react-select';

import {
  Button
} from 'react-bootstrap';

import {
  Types
} from 'loom-data';

import DeleteButton from '../../../components/buttons/DeleteButton';
import styles from './styles.module.css';

const { SecurableTypes } = Types;

export default class DefineLinkedEntityType extends React.Component {
  static propTypes = {
    availablePropertyTypes: PropTypes.object.isRequired,
    linkFn: PropTypes.func.isRequired
  }

  constructor(props) {
    const selectedPropertyTypes = Object.keys(props.availablePropertyTypes).filter((id) => {
      return (!props.availablePropertyTypes[id].piiField);
    });

    super(props);
    this.state = {
      availablePropertyTypes: props.availablePropertyTypes,
      selectedPropertyTypes,
      primaryKey: [],
      titleValue: '',
      namespaceValue: '',
      nameValue: '',
      descriptionValue: '',
      addPropValue: '',
      noPrimaryKeyError: false,
      noTypeOrTitleError: false,
      deidentify: true
    };
  }

  componentWillReceiveProps(newProps) {
    let selectedPropertyTypes = Object.keys(newProps.availablePropertyTypes);
    if (this.state.deidentify) {
      selectedPropertyTypes = selectedPropertyTypes.filter((id) => {
        return (!newProps.availablePropertyTypes[id].piiField);
      });
    }
    const primaryKey = this.state.primaryKey.filter((id) => {
      return (selectedPropertyTypes.includes(id));
    });
    this.setState({
      availablePropertyTypes: newProps.availablePropertyTypes,
      selectedPropertyTypes,
      primaryKey,
      addPropValue: '',
      noPrimaryKeyError: false
    });
  }

  deselectProp = (propertyTypeId) => {
    const selectedPropertyTypes = this.state.selectedPropertyTypes.filter((id) => {
      return (id !== propertyTypeId);
    });
    const primaryKey = this.state.primaryKey.filter((id) => {
      return (id !== propertyTypeId);
    });
    this.setState({ selectedPropertyTypes, primaryKey });
  }

  toggleCheckbox = (checked, propertyTypeId) => {
    const primaryKey = this.state.primaryKey.filter((id) => {
      return (id !== propertyTypeId);
    });
    if (checked) primaryKey.push(propertyTypeId);
    this.setState({ primaryKey });
  }

  renderPrimaryKeyCheckbox = (propertyTypeId) => {
    return (
      <input
          type="checkbox"
          id={`pkey-${propertyTypeId}`}
          onClick={(e) => {
            this.toggleCheckbox(e.target.checked, propertyTypeId);
          }} />
    );
  }

  addPropertyType = (e) => {
    const selectedPropertyTypes = this.state.selectedPropertyTypes;
    if (e && e.value && !selectedPropertyTypes.includes(e.value)) {
      selectedPropertyTypes.push(e.value);
      this.setState({
        selectedPropertyTypes,
        addPropValue: ''
      });
    }
  }

  getAvailablePropertyIds = () => {
    const availablePropertyTypes = this.state.availablePropertyTypes;
    const x = (!this.state.deidentify) ? Object.keys(availablePropertyTypes) :
      Object.keys(availablePropertyTypes).filter((propertyTypeId) => {
        return (!availablePropertyTypes[propertyTypeId].piiField);
      });
    return x;
  }

  renderAddPropertyType = () => {
    const { availablePropertyTypes, selectedPropertyTypes } = this.state;
    const availablePropertyIds = this.getAvailablePropertyIds();
    if (availablePropertyIds.length === selectedPropertyTypes.length) return null;
    const deselectedProps = availablePropertyIds.filter((id) => {
      return (!selectedPropertyTypes.includes(id));
    });
    const addPropOptions = deselectedProps.map((id) => {
      return { value: id, label: availablePropertyTypes[id].title };
    });

    return (
      <tr>
        <td />
        <td className={styles.tableCell}>
          <Select
              options={addPropOptions}
              value={this.state.addPropValue}
              onChange={this.addPropertyType} />
        </td>
        <td />
      </tr>
    );
  }

  link = () => {
    const {
      selectedPropertyTypes,
      primaryKey,
      titleValue,
      descriptionValue,
      nameValue,
      namespaceValue,
      deidentify
    } = this.state;
    if (titleValue.length < 1 || namespaceValue.length < 1 || nameValue.length < 1) {
      this.setState({ noTypeOrTitleError: true });
    }
    else if (primaryKey.length <= 0) {
      this.setState({ noPrimaryKeyError: true });
    }
    else {
      const entityType = {
        type: {
          namespace: namespaceValue,
          name: nameValue
        },
        title: titleValue,
        description: descriptionValue,
        key: primaryKey,
        properties: selectedPropertyTypes,
        category: SecurableTypes.LinkingEntityType,
        schemas: []
      };
      this.props.linkFn(entityType, deidentify);
      this.setState({
        noTypeOrTitleError: false,
        noPrimaryKeyError: false
      });
    }
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

  handleDeidentifyChange = (e) => {
    const selectedPropertyTypes = (!e.target.checked) ? this.state.selectedPropertyTypes :
      this.state.selectedPropertyTypes.filter((propertyTypeId) => {
        return (!this.state.availablePropertyTypes[propertyTypeId].piiField);
      });

    const primaryKey = (!e.target.checked) ? this.state.primaryKey : this.state.primaryKey.filter((propertyTypeId) => {
      return (!this.state.availablePropertyTypes[propertyTypeId].piiField);
    });

    this.setState({
      deidentify: e.target.checked,
      selectedPropertyTypes,
      primaryKey
    });
  }

  renderDeidentify = () => {
    return (
      <div className={styles.inputRowCheckbox}>
        <label className={styles.inputLabel} htmlFor="deidentify">Deidentify: </label>
        <input
            id="deidentify"
            type="checkbox"
            defaultChecked={this.state.deidentify}
            onChange={this.handleDeidentifyChange} />
      </div>
    );
  }

  renderInputFields = () => {
    return (
      <div className={styles.inputsWrapper_3}>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label htmlFor="namespace">Namespace:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="namespace"
                type="text"
                value={this.state.namespaceValue}
                onChange={this.handleNamespaceChange}
                className={styles.inputBox} />
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label className={styles.inputBox} htmlFor="name">Name:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="name"
                type="text"
                value={this.state.nameValue}
                onChange={this.handleNameChange}
                className={styles.inputBox} />
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label className={styles.inputBox} htmlFor="title">Title:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="title"
                type="text"
                value={this.state.titleValue}
                onChange={this.handleTitleChange}
                className={styles.inputBox} />
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label className={styles.inputBox} htmlFor="description">Description:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="description"
                type="text"
                value={this.state.descriptionValue}
                onChange={this.handleDescriptionChange}
                className={styles.inputBox} />
          </div>
        </div>
      </div>
    );
  }

  renderError = () => {
    if (this.state.noTypeOrTitleError) {
      return (
        <div className={styles.error}>You must choose a namespace, name, title, and primary key.</div>
      );
    }
    if (this.state.noPrimaryKeyError) {
      return (
        <div className={styles.error}>You must choose at least one property type as a primary key.</div>
      );
    }
    return null;
  }

  render() {
    const propertyTypes = this.state.selectedPropertyTypes.map((propertyTypeId) => {
      return (
        <tr key={propertyTypeId}>
          <td>
            <DeleteButton
                onClick={() => {
                  this.deselectProp(propertyTypeId);
                }} /></td>
          <td className={styles.tableCell}>{this.state.availablePropertyTypes[propertyTypeId].title}</td>
          <td className={styles.tableCell}>{this.renderPrimaryKeyCheckbox(propertyTypeId)}</td>
        </tr>
      );
    });
    return (
      <div className={styles.linkedDefinitionContainer}>
        <div className={styles.explanationText}>
          Step 3. Define the linked entity type for returning your results.</div>
        <br />
        <div className={styles.entityTypeTableWrapper}>
          {this.renderInputFields()}
          {this.renderDeidentify()}
          <table>
            <tbody>
              <tr>
                <th />
                <th className={styles.tableCell}>Property Type</th>
                <th className={styles.tableCell}>Primary Key</th>
              </tr>
              {propertyTypes}
              {this.renderAddPropertyType()}
            </tbody>
          </table>
          <Button
              bsStyle="primary"
              onClick={this.link}
              className={styles.linkButton}>Create linked entity type</Button>
          {this.renderError()}
        </div>
      </div>
    );
  }
}
