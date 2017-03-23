import React, { PropTypes } from 'react';
import Select from 'react-select';
import StringConsts from '../../../../utils/Consts/StringConsts';
import styles from '../styles.module.css';

export class NameNamespaceAutosuggest extends React.Component {
  static propTypes = {
    searchFn: PropTypes.func,
    usedProperties: PropTypes.array,
    className: PropTypes.string,
    addProperty: PropTypes.func,
    onNameChange: PropTypes.func,
    onNamespaceChange: PropTypes.func,
    onFQNChange: PropTypes.func,
    initialName: PropTypes.string,
    initialNamespace: PropTypes.string
  }

  constructor(props) {
    super(props);
    const nameVal = (props.initialName) ? props.initialName : StringConsts.EMPTY;
    const namespaceVal = (props.initialNamespace) ? props.initialNamespace : StringConsts.EMPTY;

    this.state = {
      nameVal,
      nameSuggestions: [],
      namespaceVal,
      namespaceSuggestions: []
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
    if (nextProps.usedProperties !== undefined) {
      newState.usedProperties = nextProps.usedProperties;
    }
    this.setState(newState);
  }

  loadInitialSuggestionValues = () => {
    this.loadSuggestionValues(true, this.state.nameVal)
    .then((suggestions) => {
      if (suggestions) {
        this.setState({
          nameSuggestions: suggestions.names,
          namespaceSuggestions: suggestions.namespaces
        });
      }
    });
  }

  loadSuggestionValues = (isNameUpdate, newValue) => {
    const nameValue = (isNameUpdate) ? newValue : this.state.nameVal;
    const namespaceValue = (isNameUpdate) ? this.state.namespaceVal : newValue;
    return this.getSuggestions(nameValue, namespaceValue)
    .then((suggestions) => {
      return suggestions;
    });
  }

  getSuggestions = (nameVal, namespaceVal) => {
    if (!this.props || this.props === undefined) return null;
    const names = [];
    const namespaces = [];
    const nameSet = new Set();
    const namespaceSet = new Set();
    const inputName = ((nameVal === undefined) ? StringConsts.EMPTY : nameVal).trim().toLowerCase();
    const inputNamespace = ((namespaceVal === undefined) ? StringConsts.EMPTY : namespaceVal).trim().toLowerCase();
    return this.props.searchFn({
      namespace: inputNamespace,
      name: inputName,
      start: 0,
      maxHits: 20
    }).then((propertyTypes) => {
      propertyTypes.hits.forEach((suggestion) => {
        if (!this.props.usedProperties.includes(suggestion.id)) {
          const name = suggestion.type.name.trim().toLowerCase();
          const namespace = suggestion.type.namespace.trim().toLowerCase();
          if (!nameSet.has(name)) {
            names.push({ label: name, value: name });
            nameSet.add(name);
          }
          if (!namespaceSet.has(namespace)) {
            namespaces.push({ label: namespace, value: namespace });
            namespaceSet.add(namespace);
          }
        }
      });
      return { namespaces, names };
    });
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
    if (this.props.onNameChange) {
      this.props.onNameChange(value);
    }
    this.loadSuggestionValues(true, value)
    .then((suggestions) => {
      const namespaceVal = (suggestions.namespaces.length === 1) ?
        suggestions.namespaces[0].value : this.state.namespaceVal;
      if (this.props.onFQNChange) {
        this.props.onFQNChange({
          name: value,
          namespace: namespaceVal
        });
      }
      this.setState({
        nameVal: value,
        namespaceVal,
        nameSuggestions: suggestions.names,
        namespaceSuggestions: suggestions.namespaces
      });
    });
  }

  onNameChange = (e) => {
    const nameVal = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.onNameInputChange(nameVal);
  }

  onNamespaceInputChange = (value) => {
    if (this.props.onNamespaceChange) {
      this.props.onNamespaceChange(value);
    }
    if (this.props.onFQNChange) {
      this.props.onFQNChange({
        name: this.state.nameVal,
        namespace: value
      });
    }
    this.loadSuggestionValues(false, value)
    .then((suggestions) => {
      this.setState({
        namespaceVal: value,
        nameSuggestions: suggestions.names,
        namespaceSuggestions: suggestions.namespaces
      });
    });
  }

  onNamespaceChange = (e) => {
    const namespaceVal = (e && e !== undefined) ? e.value : StringConsts.EMPTY;
    this.onNamespaceInputChange(namespaceVal);
  }

  onFocus = () => {
    this.loadInitialSuggestionValues();
  }

  render() {
    const { nameVal, nameSuggestions, namespaceVal, namespaceSuggestions } = this.state;
    return (
      <tr className={this.props.className}>
        <td />
        <td className={styles.tableCell}>
          <Select
              options={nameSuggestions}
              value={nameVal}
              onChange={this.onNameChange}
              onInputChange={this.onNameInputChange}
              onFocus={this.onFocus}
              placeholder="name" />
        </td>
        <td className={styles.tableCell}>
          <Select
              options={namespaceSuggestions}
              value={namespaceVal}
              onChange={this.onNamespaceChange}
              onInputChange={this.onNamespaceInputChange}
              onFocus={this.onFocus}
              placeholder="namespace" />
        </td>
        <td>
          <button className={styles.genericButton} onClick={this.handleSubmit}>Save</button>
        </td>
      </tr>
    );
  }
}

export default NameNamespaceAutosuggest;
