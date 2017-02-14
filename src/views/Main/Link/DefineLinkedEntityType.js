import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Select from 'react-select';
import buttonStyles from '../../../core/styles/buttons.css';
import styles from './styles.module.css';

export default class DefineLinkedEntityType extends React.Component {
  static propTypes = {
    linkedProps: PropTypes.array.isRequired,
    availablePropertyTypes: PropTypes.object.isRequired,
    linkFn: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      linkedProps: props.linkedProps,
      availablePropertyTypes: props.availablePropertyTypes,
      selectedPropertyTypes: Object.keys(props.availablePropertyTypes),
      primaryKey: [],
      titleValue: '',
      namespaceValue: '',
      nameValue: '',
      descriptionValue: '',
      addPropValue: '',
      noPrimaryKeyError: false,
      noTypeOrTitleError: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      linkedProps: newProps.linkedProps,
      availablePropertyTypes: newProps.availablePropertyTypes,
      selectedPropertyTypes: Object.keys(newProps.availablePropertyTypes),
      primaryKey: [],
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

  renderDeleteButton = (propertyTypeId) => {
    if (this.state.linkedProps.includes(propertyTypeId)) return null;
    return (
      <button
          className={buttonStyles.deleteButton}
          onClick={() => {
            this.deselectProp(propertyTypeId);
          }}>-
      </button>
    );
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

  renderAddPropertyType = () => {
    const { availablePropertyTypes, selectedPropertyTypes } = this.state;
    const availablePropertyIds = Object.keys(availablePropertyTypes);
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
    const { selectedPropertyTypes, primaryKey, titleValue, descriptionValue, nameValue, namespaceValue } = this.state;
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
        schemas: []
      };
      this.props.linkFn(entityType);
      this.setState({
        noTypeOrTitleError: false,
        noPrimaryKeyError: false
      });
    }
  }

  handleNamespaceChange = (e) => {
    this.setState({ namespaceValue: e.target.value });
  }

  renderNamespaceField = () => {
    return (
      <span className={styles.inputRow}>
        <label htmlFor="namespace">Namespace:</label>
        <input
            id="namespace"
            type="text"
            value={this.state.namespaceValue}
            onChange={this.handleNamespaceChange}
            className={styles.inputBox} />
      </span>
    );
  }

  handleNameChange = (e) => {
    this.setState({ nameValue: e.target.value });
  }

  renderNameField = () => {
    return (
      <span className={styles.inputRow}>
        <label className={styles.inputBox} htmlFor="name">Name:</label>
        <input
            id="name"
            type="text"
            value={this.state.nameValue}
            onChange={this.handleNameChange}
            className={styles.inputBox} />
      </span>
    );
  }

  handleTitleChange = (e) => {
    this.setState({ titleValue: e.target.value });
  }

  renderTitleField = () => {
    return (
      <div className={styles.inputRow}>
        <label htmlFor="title">Title:</label>
        <input
            id="title"
            type="text"
            value={this.state.titleValue}
            onChange={this.handleTitleChange}
            className={styles.longInputBox} />
      </div>
    );
  }

  handleDescriptionChange = (e) => {
    this.setState({ descriptionValue: e.target.value });
  }

  renderDescriptionField = () => {
    return (
      <div className={styles.inputRow}>
        <label htmlFor="description">Description:</label>
        <input
            id="description"
            type="text"
            value={this.state.descriptionValue}
            onChange={this.handleDescriptionChange}
            className={styles.longInputBox} />
      </div>
    );
  }

  renderInputFields = () => {
    return (
      <div>
        {this.renderNamespaceField()}
        {this.renderNameField()}
        {this.renderTitleField()}
        {this.renderDescriptionField()}
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
          <td>{this.renderDeleteButton(propertyTypeId)}</td>
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
