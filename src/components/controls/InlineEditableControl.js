/*
 * @flow
 */

import React from 'react';

import FontAwesome from 'react-fontawesome';
import styled from 'styled-components';

const ControlWrapper = styled.div.withConfig({ displayName: 'ControlWrapper' })`
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

const TextControl = styled.div.withConfig({ displayName: 'TextControl' })`
  border: 1px solid transparent;
  position: relative;
  font-size: ${(props) => {
    return props.styleMap.fontSize;
  }};
  line-height: ${(props) => {
    return props.styleMap.lineHeight;
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

const STYLE_MAP = {
  medium: {
    fontSize: '20px',
    inputFontSize: '18px',
    lineHeight: '24px',
    padding: '8px 12px'
  },
  xlarge: {
    fontSize: '32px',
    inputFontSize: '30px',
    lineHeight: '36px',
    padding: '10px 12px'
  }
};

export default class EditableTextField extends React.Component {

  static propTypes = {
    type: React.PropTypes.string,
    size: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired
  };

  control :any
  controlWrapper :any
  state :{
    editable :boolean,
    controlValue :string
  }

  constructor(props :Object) {

    super(props);

    this.control = null;
    this.controlWrapper = null;
    this.state = {
      editable: false,
      controlValue: this.props.value
    };
  }

  componentDidUpdate(prevProps :Object, prevState :Object) {

    if (this.state.editable && this.control) {
      this.control.focus();
    }

    if (prevState.editable === true && this.state.editable === false) {
      this.props.onChange(this.state.controlValue);
    }
  }

  toggleEditMode = () => {

    if (!this.state.controlValue) {
      return;
    }

    this.setState({
      editable: !this.state.editable
    });
  }

  handleOnBlur = () => {

    this.toggleEditMode();
  }

  handleOnChange = (event :SyntheticInputEvent) => {

    this.setState({
      controlValue: event.target.value
    });
  }

  handleOnKeyDown = (event :SyntheticKeyboardEvent) => {

    switch (event.keyCode) {
      case 13: // 'Enter' key code
      case 27: // 'Esc' key code
        this.toggleEditMode();
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
            value={this.state.controlValue}
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
          onClick={this.toggleEditMode}
          innerRef={(element) => {
            this.control = element;
          }}>
        { this.state.controlValue }
      </TextControl>
    );
  }

  renderTextAreaControl = () => {

    if (this.state.editable) {
      // +2 1px border
      STYLE_MAP[this.props.size].height = `${Math.ceil(this.control.clientHeight) + 2}px`;
      return (
        <TextAreaControl
            styleMap={STYLE_MAP[this.props.size]}
            placeholder={this.props.placeholder}
            value={this.state.controlValue}
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
          onClick={this.toggleEditMode}
          innerRef={(element) => {
            this.control = element;
          }}>
        { this.state.controlValue }
      </TextControl>
    );
  };

  render() {

    let button;
    if (this.state.editable) {
      button = (
        <SaveIcon className="icon" onClick={this.toggleEditMode}>
          <FontAwesome name="check" />
        </SaveIcon>
      );
    }
    else {
      button = (
        <EditIcon className="icon" onClick={this.toggleEditMode}>
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
