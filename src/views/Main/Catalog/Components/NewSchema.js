import React, { PropTypes } from 'react';
import { EntityDataModelApi } from 'loom-data';
import { InputField } from './InputField';
import StringConsts from '../../../../utils/Consts/StringConsts';
import styles from '../styles.module.css';

const NAME_FIELD = 'name';
const NAMESPACE_FIELD = 'namespace';

const INITIAL_STATE = {
  [NAME_FIELD]: StringConsts.EMPTY,
  [NAMESPACE_FIELD]: StringConsts.EMPTY,
  editing: false,
  error: false
};

export class NewSchema extends React.Component {

  static propTypes = {
    createSuccess: PropTypes.func
  }

  constructor() {
    super();
    this.state = INITIAL_STATE;
  }

  errorClass = {
    true: styles.errorMsg,
    false: styles.hidden
  }

  handleInputChange = (newState) => {
    this.setState(newState);
  }

  setEditing = () => {
    this.setState({ editing: true });
  }

  createNewSchema = () => {
    EntityDataModelApi.createSchema({
      namespace: this.state[NAMESPACE_FIELD],
      name: this.state[NAME_FIELD]
    }).then(() => {
      this.props.createSuccess();
      this.setState(INITIAL_STATE);
    }).catch(() => {
      this.setState({ error: true });
    });
  }

  renderButton = () => {
    const className = (this.state.editing) ? styles.hidden : styles.genericButton;
    return (
      <button
        onClick={this.setEditing}
        className={className}
      >Create a new schema
      </button>
    );
  }

  renderInput = () => {
    const className = (this.state.editing) ? StringConsts.EMPTY : styles.hidden;
    return (
      <div className={className}>
        <InputField
          title="Schema Namespace"
          name={NAMESPACE_FIELD}
          value={this.state[NAMESPACE_FIELD]}
          updateFn={this.handleInputChange}
        />
        <InputField
          title="Schema Name"
          name={NAME_FIELD}
          value={this.state[NAME_FIELD]}
          updateFn={this.handleInputChange}
        />
        <button className={styles.genericButton} onClick={this.createNewSchema}>Create</button>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderButton()}
        {this.renderInput()}
        <div className={this.errorClass[this.state.error]}>Unable to create schema.</div>
      </div>
    );
  }
}

export default NewSchema;
