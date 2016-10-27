import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import { Button } from 'react-bootstrap';
import Consts from '../../../../utils/AppConsts';
import '../../../../styles/autosuggest.css';
import styles from '../styles.module.css';

const getSuggestionValue = (suggestion) => {
  return suggestion;
};

const renderSuggestion = (suggestion) => {
  return (
    <div>
      {suggestion}
    </div>
  );
};

export class NameNamespaceAutosuggest extends React.Component {
  static propTypes = {
    id: PropTypes.number,
    namespaces: PropTypes.object,
    className: PropTypes.string,
    addProperty: PropTypes.func,
    type: PropTypes.string,
    saveOption: PropTypes.bool
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

  showSave = {
    true: Consts.EMPTY,
    false: styles.hidden
  };

  getSuggestions = (getNames, newValue) => {
    const suggestions = [];
    const inputName = (getNames) ? newValue.trim().toLowerCase() : this.state.nameVal.trim().toLowerCase();
    const inputNamespace = (getNames) ? this.state.namespaceVal.trim().toLowerCase() : newValue.trim().toLowerCase();
    const allNamespaces = Object.keys(this.props.namespaces);
    allNamespaces.forEach((namespace) => {
      if (namespace.trim().toLowerCase().slice(0, inputNamespace.length) === inputNamespace) {
        const possibleNames = this.props.namespaces[namespace];
        possibleNames.forEach((name) => {
          if (name.trim().toLowerCase().slice(0, inputName.length) === inputName) {
            const valueToAdd = (getNames) ? name : namespace;
            if (!suggestions.includes(valueToAdd)) suggestions.push(valueToAdd);
          }
        });
      }
    });
    return suggestions;
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

  onNameSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      nameSuggestions: this.getSuggestions(true, value)
    });
  }

  onNamespaceSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      namespaceSuggestions: this.getSuggestions(false, value)
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
        <td id={`newName${this.props.type}${this.props.id}`}>
          <Autosuggest
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={this.onNameSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onNameSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps.name}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
          />
        </td>
        <td id={`newNamespace${this.props.type}${this.props.id}`}>
          <Autosuggest
            suggestions={namespaceSuggestions}
            onSuggestionsFetchRequested={this.onNamespaceSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onNamespaceSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps.namespace}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
          />
        </td>
        <td className={this.showSave[this.props.saveOption]}><Button onClick={this.handleSubmit}>Save</Button></td>
      </tr>
    );
  }
}

export default NameNamespaceAutosuggest;
