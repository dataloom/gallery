import React, { PropTypes } from 'react';
import Autosuggest from 'react-autosuggest';
import EdmConsts from '../../../../utils/Consts/EdmConsts';
import '../../../../styles/autosuggest.css';

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

export class EdmDatatypeAutosuggest extends React.Component {
  static propTypes = {
    onChangeFn: PropTypes.func,
    initialValue: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
      suggestions: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.initialValue });
  }

  getSuggestions(value) {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : EdmConsts.EDM_PRIMITIVE_TYPES.filter((type) => {
      return type.toLowerCase().slice(0, inputLength) === inputValue;
    });
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

  onSuggestionSelected = ({ suggestion }) => {
    if (suggestion !== undefined) {
      this.props.onChangeFn(suggestion);
    }
  }

  onChange = (event, { newValue }) => {
    if (newValue !== undefined) {
      this.props.onChangeFn(newValue);
    }
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
        onSuggestionSelected={this.onSuggestionSelected}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
      />
    );
  }
}

export default EdmDatatypeAutosuggest;
