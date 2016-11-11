import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
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
    namespaces: PropTypes.object,
    className: PropTypes.string,
    addProperty: PropTypes.func,
    saveOption: PropTypes.bool,
    onNameChange: PropTypes.func,
    onNamespaceChange: PropTypes.func,
    initialName: PropTypes.string,
    initialNamespace: PropTypes.string
  }

  constructor(props) {
    super(props);
    const nameVal = (props.initialName) ? props.initialName : '';
    const namespaceVal = (props.initialNamespace) ? props.initialNamespace : '';
    this.state = {
      nameVal,
      nameSuggestions: [],
      namespaceVal,
      namespaceSuggestions: []
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialName !== undefined && nextProps.initialNamespace !== undefined) {
      this.setState({
        nameVal: nextProps.initialName,
        namespaceVal: nextProps.initialNamespace
      });
    }
  }

  showSave = {
    true: Consts.EMPTY,
    false: styles.hidden
  };

  onNameSuggestionSelected = ({ suggestion }) => {
    if (this.props.onNameChange !== undefined && suggestion !== undefined) {
      this.props.onNameChange(suggestion);
    }
  };

  onNamespaceSuggestionSelected = ({ suggestion }) => {
    if (this.props.onNamespaceChange !== undefined && suggestion !== undefined) {
      this.props.onNamespaceChange(suggestion);
    }
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
    if (this.props.onNameChange !== undefined && newValue !== undefined) {
      this.props.onNameChange(newValue);
    }
    this.setState({
      nameVal: newValue
    });
  }

  onNamespaceChange = (event, { newValue }) => {
    if (this.props.onNamespaceChange !== undefined && newValue !== undefined) {
      this.props.onNamespaceChange(newValue);
    }
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
        <td>
          <Autosuggest
            suggestions={nameSuggestions}
            onSuggestionsFetchRequested={this.onNameSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onNameSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            onSuggestionSelected={this.onNameSuggestionSelected}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps.name}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
          />
        </td>
        <td>
          <Autosuggest
            suggestions={namespaceSuggestions}
            onSuggestionsFetchRequested={this.onNamespaceSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onNamespaceSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            onSuggestionSelected={this.onNamespaceSuggestionSelected}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps.namespace}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
          />
        </td>
        <td className={this.showSave[this.props.saveOption]}>
          <button className={styles.genericButton} onClick={this.handleSubmit}>Save</button></td>
      </tr>
    );
  }
}

export default NameNamespaceAutosuggest;
