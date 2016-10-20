import React from 'react';
import Autosuggest from 'react-autosuggest';
import Utils from '../../../../utils/Utils';
import '../../../../styles/autosuggest.css';

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
  <div>
    {suggestion}
  </div>
);

export class EdmDatatypeAutosuggest extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      suggestions: []
    };
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : Utils.getAllEdmPrimitiveTypes().filter(type =>
      type.toLowerCase().slice(0, inputLength) === inputValue);
  }

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  }

  shouldRenderSuggestions() {
    return true;
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'datatype',
      value,
      onChange: this.onChange
    };
    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
      />
    );
  }
}

export default EdmDatatypeAutosuggest;
