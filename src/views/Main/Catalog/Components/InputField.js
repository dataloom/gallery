import React, { PropTypes } from 'react';
import styles from '../styles.module.css';

export class InputField extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    updateFn: PropTypes.func
  }

  handleChange = (e) => {
    this.props.updateFn({ [e.target.name]: e.target.value });
  }

  render() {
    const { title, name, value, placeholder } = this.props;
    return (
      <div>
        <div>{title}</div>
        <div className={styles.spacerMini} />
        <input
          type="text"
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={this.handleChange}
          className={styles.inputBox}
        />
        <div className={styles.spacerSmall} />
      </div>
    );
  }
}

export default InputField;
