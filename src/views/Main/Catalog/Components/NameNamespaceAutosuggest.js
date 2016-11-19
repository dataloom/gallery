import React, { PropTypes } from 'react';
import Select from 'react-select';
import Consts from '../../../../utils/AppConsts';
import Utils from '../../../../utils/Utils';
import styles from '../styles.module.css';

export class NameNamespaceAutosuggest extends React.Component {
  static propTypes = {
    namespaces: PropTypes.object,
    usedProperties: PropTypes.array,
    className: PropTypes.string,
    addProperty: PropTypes.func,
    saveOption: PropTypes.bool,
    onNameChange: PropTypes.func,
    onNamespaceChange: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      nameVal: Consts.EMPTY,
      nameSuggestions: [],
      namespaceVal: Consts.EMPTY,
      namespaceSuggestions: [],
      unusedProperties: Utils.loadUnusedPairs(props.namespaces, props.usedProperties)
    };
  }

  componentDidMount() {
    this.loadInitialSuggestionValues();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.namespaces !== undefined && newProps.usedProperties !== undefined) {
      this.setState({ unusedProperties: Utils.loadUnusedPairs(newProps.namespaces, newProps.usedProperties) });
    }
  }

  showSave = {
    true: Consts.EMPTY,
    false: styles.hidden
  };

  loadInitialSuggestionValues() {
    const suggestions = this.loadSuggestionValues(true, this.state.nameVal);
    if (suggestions) this.setState(this.loadSuggestionValues(false, this.state.namespaceVal));
  }

  loadSuggestionValues(isNameUpdate, newValue) {
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
    const inputName = ((nameVal === undefined) ? Consts.EMPTY : nameVal).trim().toLowerCase();
    const inputNamespace = ((namespaceVal === undefined) ? Consts.EMPTY : namespaceVal).trim().toLowerCase();
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
      nameVal: '',
      namespaceVal: ''
    });
  }

  onNameInputChange = (value) => {
    if (this.props.onNameChange !== undefined) {
      this.props.onNameChange(value);
    }
    const suggestions = this.loadSuggestionValues(true, value);
    this.setState({
      nameVal: value,
      nameSuggestions: suggestions.nameSuggestions,
      namespaceSuggestions: suggestions.namespaceSuggestions
    });
  }

  onNameChange = (e) => {
    const nameVal = (e && e !== undefined) ? e.value : Consts.EMPTY;
    this.onNameInputChange(nameVal);
  }

  onNamespaceInputChange = (value) => {
    if (this.props.onNamespaceChange) {
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
    const namespaceVal = (e && e !== undefined) ? e.value : Consts.EMPTY;
    this.onNamespaceInputChange(namespaceVal);
  }

  onFocus = () => {
    this.loadInitialSuggestionValues();
  }

  render() {
    if (!this.props || this.props === undefined || this.state.unusedProperties === undefined) return null;
    const { nameVal, nameSuggestions, namespaceVal, namespaceSuggestions } = this.state;
    return (
      <tr className={this.props.className}>
        <td />
        <td>
          <Select
            options={nameSuggestions}
            value={nameVal}
            onChange={this.onNameChange}
            onInputChange={this.onNameInputChange}
            onFocus={this.onFocus}
          />
        </td>
        <td>
          <Select
            options={namespaceSuggestions}
            value={namespaceVal}
            onChange={this.onNamespaceChange}
            onInputChange={this.onNamespaceInputChange}
            onFocus={this.onFocus}
          />
        </td>
        <td className={this.showSave[this.props.saveOption]}>
          <button className={styles.genericButton} onClick={this.handleSubmit}>Save</button></td>
      </tr>
    );
  }
}

export default NameNamespaceAutosuggest;
