import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Button } from 'react-bootstrap';
import '../../../../styles/autosuggest.css';

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

export class NameNamespaceAutosuggest extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    names: PropTypes.object,
    namespaces: PropTypes.object,
    className: PropTypes.string,
    addProperty: PropTypes.func,
    type: PropTypes.string
  }

  constructor() {
    super();
    this.state = {
      nameVal: '',
      nameSuggestions: [],
      namespaceVal: '',
      namespaceSuggestions: []
    };
  }

  getNamespaceVal = () => document
    .getElementById('newNamespace'
      .concat(this.props.type)
      .concat(this.props.id)
    ).firstChild
    .firstChild
    .value;

  getNameVal = () => document
    .getElementById('newName'
      .concat(this.props.type)
      .concat(this.props.id)
    ).firstChild
    .firstChild
    .value;

  getSuggestions(focused, unfocused, focusedList, unfocusedList) {
    const suggestions = [];
    const focusedVal = focused.trim().toLowerCase();
    const focusedLength = focusedVal.length;
    const unfocusedVal = unfocused.trim().toLowerCase();
    const unfocusedLength = unfocusedVal.length;
    const allUnfocusedListKeys = Object.keys(unfocusedList);
    allUnfocusedListKeys.forEach((unfocusedKey) => {
      if (unfocusedKey.trim().toLowerCase().slice(0, unfocusedLength) === unfocusedVal) {
        const possibleSuggestions = unfocusedList[unfocusedKey];
        possibleSuggestions.forEach((focusedKey) => {
          if (focusedKey.trim().toLowerCase().slice(0, focusedLength) === focusedVal) {
            if (!suggestions.includes(focusedKey)) suggestions.push(focusedKey);
          }
        });
      }
    });
    return suggestions;
  }

  handleSubmit = () => {
    const namespace = this.getNamespaceVal();
    const name = this.getNameVal();
    this.props.addProperty(namespace, name);
    this.setState({
      nameVal: '',
      namespaceVal: ''
    });
  }

  onNameSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      nameSuggestions: this.getSuggestions(value, this.getNamespaceVal(), this.props.names, this.props.namespaces)
    });
  }

  onNamespaceSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      namespaceSuggestions: this.getSuggestions(value, this.getNameVal(), this.props.namespaces, this.props.names)
    });
  }

  onNameSuggestionsClearRequested = () => {
    this.setState({
      nameSuggestions: []
    });
  };

  onNamespaceSuggestionsClearRequested = () => {
    this.setState({
      namespaceSuggestions: []
    });
  };

  onNameChange = (event, { newValue }) => {
    this.setState({
      nameVal: newValue
    });
  }

  onNamespaceChange = (event, { newValue }) => {
    this.setState({
      namespaceVal: newValue
    });
  }

  shouldRenderSuggestions() {
    return true;
  }

  render() {
    const { nameVal, nameSuggestions, namespaceVal, namespaceSuggestions } = this.state;
    const inputProps = {
      name: {
        placeholder: 'name',
        value: nameVal,
        onChange: this.onNameChange
      },
      namespace: {
        placeholder: 'namespace',
        value: namespaceVal,
        onChange: this.onNamespaceChange
      }
    };
    return (
      <tr className={this.props.className}>
        <td />
        <td id={'newName'.concat(this.props.type).concat(this.props.id)}><Autosuggest
          suggestions={nameSuggestions}
          onSuggestionsFetchRequested={this.onNameSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onNameSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps.name}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
        /></td>
        <td id={'newNamespace'.concat(this.props.type).concat(this.props.id)}><Autosuggest
          suggestions={namespaceSuggestions}
          onSuggestionsFetchRequested={this.onNamespaceSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onNamespaceSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps.namespace}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
        /></td>
        <td><Button onClick={this.handleSubmit}>Save</Button></td>
      </tr>
    );
  }
}

export default NameNamespaceAutosuggest;
