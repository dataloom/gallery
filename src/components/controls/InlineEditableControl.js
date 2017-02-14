/*
 * @flow
 */

import React from 'react';

import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

import { isNonEmptyString } from '../../utils/LangUtils';

const ControlWrapper = styled.div`
  min-height: 30px;
  width: 100%;
  margin: 0;
  padding: 0;
  display: inline-flex;
  &:hover {
    cursor: pointer;
    .control {
      border: 1px solid #cfd8dc;
    }
    .icon {
      visibility: visible;
    }
  }
`;

const Icon = styled.div`
  border-style: solid;
  border-width: 1px;
  height: 32px;
  width: 32px;
  margin-left: 10px;
  padding: 0;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`;

const EditIcon = styled(Icon)`
  background-color: #ffffff;
  border-color: #cfd8dc;
  visibility: hidden;
`;

const SaveIcon = styled(Icon)`
  background-color: #4203c5;
  border-color: #4203c5;
  color: #ffffff;
  visibility: visible;
`;

const TextControl = styled.div`
  border: 1px solid transparent;
  position: relative;
  font-size: ${(props) => {
    return props.styleMap.fontSize;
  }};
  line-height: ${(props) => {
    return props.styleMap.lineHeight;
  }};
  margin: ${(props) => {
    return props.styleMap.margin;
  }};
  padding: ${(props) => {
    return props.styleMap.padding;
  }};
`;

const TextInputControl = styled.input`
  border: 1px solid #4203c5;
  margin: 0;
  width: 100%;
  font-size: ${(props) => {
    return props.styleMap.inputFontSize;
  }};
  line-height: ${(props) => {
    return props.styleMap.lineHeight;
  }};
  margin: ${(props) => {
    return props.styleMap.margin;
  }};
  padding: ${(props) => {
    return props.styleMap.padding;
  }};
  &:focus {
    outline: none;
  }
`;

const TextAreaControl = styled.textarea`
  border: 1px solid #4203c5;
  margin: 0;
  min-height: 100px;
  width: 100%;
  font-size: ${(props) => {
    return props.styleMap.inputFontSize;
  }};
  height: ${(props) => {
    return props.styleMap.height ? props.styleMap.height : 'auto';
  }};
  line-height: ${(props) => {
    return props.styleMap.lineHeight;
  }};
  margin: ${(props) => {
    return props.styleMap.margin;
  }};
  padding: ${(props) => {
    return props.styleMap.padding;
  }};
  &:focus {
    outline: none;
  }
`;

const TYPES = {
  TEXT: 'text',
  TEXA_AREA: 'textarea'
};

/*
 * the negative margin-left is to adjust for the padding + border offset
 */
const STYLE_MAP = {
  medium: {
    fontSize: '20px',
    inputFontSize: '18px',
    lineHeight: '24px',
    margin: '0 0 0 -13px',
    padding: '8px 12px'
  },
  xlarge: {
    fontSize: '32px',
    inputFontSize: '30px',
    lineHeight: '36px',
    margin: '0 0 0 -13px',
    padding: '10px 12px'
  }
};

export default class InlineEditableControl extends React.Component {

  // TODO: take in a prop that can disable the ability to edit altogether
  static propTypes = {
    type: React.PropTypes.string.isRequired,
    size: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func
  };

  static defaultProps = {
    style: {},
    placeholder: '',
    value: '',
    onChange: () => {}
  };

  control :any
  controlWrapper :any
  state :{
    editable :boolean,
    currentValue :string,
    previousValue :string
  }

  constructor(props :Object) {

    super(props);

    const initialValue = isNonEmptyString(this.props.value) ? this.props.value : '';
    const initializeAsEditable = !isNonEmptyString(initialValue);

    this.control = null;
    this.controlWrapper = null;

    this.state = {
      editable: initializeAsEditable,
      currentValue: initialValue,
      previousValue: initialValue
    };
  }

  componentDidUpdate(prevProps :Object, prevState :Object) {

    console.log('InlineEditableControl.componentDidUpdate()');
    console.log('prevState', prevState);
    console.log('thisState', this.state);

    if (this.control
        && prevState.editable === false
        && this.state.editable === true) {
      // BUG: if there's multiple InlineEditableControl components on the page, the focus might not be on the desired
      // element. perhaps need to take in a prop to indicate focus
      this.control.focus();
    }

    // going from editable to not editable should invoke the onChange callback only if the value actually changed
    if (prevState.previousValue !== this.state.currentValue
        && prevState.editable === true
        && this.state.editable === false) {
      this.props.onChange(this.state.currentValue);
    }
  }

  componentWillReceiveProps(nextProps :Object) {

    if (this.props.value !== nextProps.value) {
      const newValue = isNonEmptyString(nextProps.value) ? nextProps.value : '';
      const initializeAsEditable = !isNonEmptyString(newValue);
      this.setState({
        editable: initializeAsEditable,
        currentValue: newValue,
        previousValue: newValue
      });
    }
  }

  toggleEditable = () => {

    if (!this.state.currentValue) {
      return;
    }

    this.setState({
      editable: !this.state.editable,
      previousValue: this.state.currentValue
    });
  }

  handleOnBlur = () => {

    this.toggleEditable();
  }

  handleOnChange = (event :SyntheticInputEvent) => {

    this.setState({
      currentValue: event.target.value
    });
  }

  handleOnKeyDown = (event :SyntheticKeyboardEvent) => {

    switch (event.keyCode) {
      case 13: // 'Enter' key code
      case 27: // 'Esc' key code
        this.toggleEditable();
        break;
      default:
        break;
    }
  }

  renderTextControl = () => {

    if (this.state.editable) {
      return (
        <TextInputControl
            styleMap={STYLE_MAP[this.props.size]}
            placeholder={this.props.placeholder}
            value={this.state.currentValue}
            onBlur={this.handleOnBlur}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown}
            innerRef={(element) => {
              this.control = element;
            }} />
      );
    }

    return (
      <TextControl
          className="control"
          styleMap={STYLE_MAP[this.props.size]}
          onClick={this.toggleEditable}
          innerRef={(element) => {
            this.control = element;
          }}>
        { this.state.currentValue }
      </TextControl>
    );
  }

  renderTextAreaControl = () => {

    if (this.state.editable) {
      if (this.control) {
        // +2 1px border
        STYLE_MAP[this.props.size].height = `${Math.ceil(this.control.clientHeight) + 2}px`;
      }
      return (
        <TextAreaControl
            styleMap={STYLE_MAP[this.props.size]}
            placeholder={this.props.placeholder}
            value={this.state.currentValue}
            onBlur={this.handleOnBlur}
            onChange={this.handleOnChange}
            onKeyDown={this.handleOnKeyDown}
            innerRef={(element) => {
              this.control = element;
            }} />
      );
    }

    return (
      <TextControl
          className="control"
          styleMap={STYLE_MAP[this.props.size]}
          onClick={this.toggleEditable}
          innerRef={(element) => {
            this.control = element;
          }}>
        { this.state.currentValue }
      </TextControl>
    );
  };

  render() {

    let button;
    if (this.state.editable) {
      button = (
        <SaveIcon className="icon" onClick={this.toggleEditable}>
          <FontAwesome name="check" />
        </SaveIcon>
      );
    }
    else {
      button = (
        <EditIcon className="icon" onClick={this.toggleEditable}>
          <FontAwesome name="pencil" />
        </EditIcon>
      );
    }

    let control;
    switch (this.props.type) {
      case TYPES.TEXT:
        control = this.renderTextControl();
        break;
      case TYPES.TEXA_AREA:
        control = this.renderTextAreaControl();
        break;
      default:
        control = this.renderTextControl();
        break;
    }

    return (
      <ControlWrapper
          style={this.props.style}
          styleMap={STYLE_MAP[this.props.size]}
          innerRef={(element) => {
            this.controlWrapper = element;
          }}>
        { control }
        { button }
      </ControlWrapper>
    );
  }
}
