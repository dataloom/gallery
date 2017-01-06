import React, { PropTypes } from 'react';
import Select from 'react-select';
import Utils from '../../utils/Utils';
import StringConsts from '../../utils/Consts/StringConsts';
import styles from '../../views/Main/Schemas/styles.module.css';

export class NameNamespaceAutosuggest extends React.Component {
  static propTypes = {
    namespaces: PropTypes.object,
    usedProperties: PropTypes.array,
    className: PropTypes.string,
    addProperty: PropTypes.func,
    onNameChange: PropTypes.func,
    onNamespaceChange: PropTypes.func,
    initialName: PropTypes.string,
    initialNamespace: PropTypes.string,
    noSaveButton: PropTypes.bool
  }

  constructor(props) {
    super(props);
    const nameVal = (props.initialName) ? props.initialName : StringConsts.EMPTY;
    const namespaceVal = (props.initialNamespace) ? props.initialNamespace : StringConsts.EMPTY;

    this.state = {
      nameVal,
      nameSuggestions: [],
      namespaceVal,
      namespaceSuggestions: [],
      unusedProperties: Utils.loadUnusedPairs(props.namespaces, props.usedProperties)
    };
  }

  componentDidMount() {
    this.loadInitialSuggestionValues();
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};
    if (nextProps.initialName !== undefined && nextProps.initialNamespace !== undefined) {
      newState.nameVal = nextProps.initialName;
      newState.namespaceVal = nextProps.initialNamespace;
    }
    if (nextProps.namespaces !== undefined && nextProps.usedProperties !== undefined) {
      newState.unusedProperties = Utils.loadUnusedPairs(nextProps.namespaces, nextProps.usedProperties);
    }
    this.setState(newState);
  }

  loadInitialSuggestionValues = () => {
    const suggestions = this.loadSuggestionValues(true, this.state.nameVal);
    if (suggestions) this.setState(this.loadSuggestionValues(false, this.state.namespaceVal));
  }

  loadSuggestionValues = (isNameUpdate, newValue) => {
    const nameValue = (isNameUpdate) ? newValue : this.state.nameVal;
    const namespaceValue = (isNameUpdate) ? this.state.namespaceVal : newValue;
    if (!this.props || this.props === undefined || this.state.unusedProperties === undefined) return null;
    return ({
      nameSuggestions: this.getSuggestions(true, nameValue, namespaceValue),
      namespaceSuggestions: this.getSuggestions(false, nameValue, namespaceValue)
    });
  }

  getSuggestions = (getNames, nameVal, namespaceVal) => {
    if (!this.props || this.props === undefined) return null;
    const suggestionResult = [];
    const suggestionSet = new Set();
    const inputName = ((nameVal === undefined) ? StringConsts.EMPTY : nameVal).trim().toLowerCase();
    const inputNamespace = ((namespaceVal === undefined) ? StringConsts.EMPTY : namespaceVal).trim().toLowerCase();
    const allNamespaces = Object.keys(this.state.unusedProperties);
    allNamespaces.forEach((namespace) => {
      if (namespace.trim().toLowerCase().slice(0, inputNamespace.length) === inputNamespace) {
        const possibleNames = this.state.unusedProperties[namespace];
        possibleNames.forEach((name) => {
          if (name.trim().toLowerCase().slice(0, inputName.length) === inputName) {
            const valueToAdd = (getNames) ? name : namespace;
            if (!suggestionSet.has(valueToAdd)) suggestionSet.add(valueToAdd);
          }
        });
      }
    });
    suggestionSet.forEach((suggestion) => {
      suggestionResult.push({ label: suggestion, value: suggestion });
    });
    return suggestionResult;
  }

  handleSubmit = () => {
    const namespace = this.state.namespaceVal;
    const name = this.state.nameVal;
    this.props.addProperty(namespace, name);
    this.setState({
      nameVal: StringConsts.EMPTY,
      namespaceVal: StringConsts.EMPTY
    });
  }

  onNameInputChange = (value) => {
    if (this.props.onNameChange !== undefined) {
      this.props.onNameChange(value);
    }
    const suggestions = this.loadSuggestionValues(true, value);
    const namespaceVal = (suggestions.namespaceSuggestions.length === 1) ?
      suggestions.namespaceSuggestions[0].value : this.state.namespaceVal;
    this.setState({
      nameVal: value,
      namespaceVal,
      nameSuggestions: suggestions.nameSuggestions,
      namespaceSuggestions: suggestions.namespaceSuggestions
    });
  }

  onNameChange = (e) => {
    const nameVal = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.onNameInputChange(nameVal);
  }

  onNamespaceInputChange = (value) => {
    if (this.props.onNamespaceChange !== undefined) {
      this.props.onNamespaceChange(value);
    }
    const suggestions = this.loadSuggestionValues(false, value);
    this.setState({
      namespaceVal: value,
      nameSuggestions: suggestions.nameSuggestions,
      namespaceSuggestions: suggestions.namespaceSuggestions
    });
  }

  onNamespaceChange = (e) => {
    const namespaceVal = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.onNamespaceInputChange(namespaceVal);
  }

  onFocus = () => {
    this.loadInitialSuggestionValues();
  }

  shouldHideSaveButton = () => {
    return (this.props.noSaveButton !== undefined && this.props.noSaveButton);
  }

  saveButtonClass = () => {
    return (this.shouldHideSaveButton()) ? styles.hidden : StringConsts.EMPTY;
  }

  selectInputClassName = () => {
    return (this.shouldHideSaveButton()) ? styles.entitySetInput : styles.tableCell;
  }

  render() {
    if (!this.props || this.props === undefined || this.state.unusedProperties === undefined) return null;
    const { nameVal, nameSuggestions, namespaceVal, namespaceSuggestions } = this.state;
    return (
      <tr className={this.props.className}>
        <td />
        <td className={this.selectInputClassName()}>
          <Select
            options={nameSuggestions}
            value={nameVal}
            onChange={this.onNameChange}
            onInputChange={this.onNameInputChange}
            onFocus={this.onFocus}
            placeholder="name"
          />
        </td>
        <td className={this.selectInputClassName()}>
          <Select
            options={namespaceSuggestions}
            value={namespaceVal}
            onChange={this.onNamespaceChange}
            onInputChange={this.onNamespaceInputChange}
            onFocus={this.onFocus}
            placeholder="namespace"
          />
        </td>
        <td className={this.saveButtonClass()}>
          <button className={styles.genericButton} onClick={this.handleSubmit}>Save</button>
        </td>
      </tr>
    );
  }
}

export default NameNamespaceAutosuggest;
