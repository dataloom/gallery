import React, { PropTypes } from 'react';
import styles from '../styles.module.css';

export class DropdownButton extends React.Component {
  static propTypes = {
    options: PropTypes.array,
    downloadFn: PropTypes.func,
    downloadUrlFn: PropTypes.func,
    requestFn: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: props.options[0],
      dropdownOpen: false
    };
  }

  componentDidMount() {
    this.mounted = true;
    window.addEventListener('mousedown', this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onMouseDown() {
    this.mouseDownOnComponent = true;
  }

  onMouseUp() {
    this.mouseDownOnComponent = false;
  }

  handleDocumentClick = () => {
    if (this.mounted) {
      if (this.mouseDownOnComponent) return;
      this.setState({ dropdownOpen: false });
    }
  }

  handleClick = () => {
    if (this.props.downloadFn) this.props.downloadFn(this.state.selected);
    if (this.props.requestFn) this.props.requestFn(this.state.selected);
  }

  openDropdown = () => {
    this.setState({ dropdownOpen: true });
  }

  renderDownloadButton = (text) => {
    let className = styles.downloadButton;
    if (this.props.options.length <= 1) {
      className = `${className} ${styles.singleOption}`;
    }
    if (this.props.requestFn) {
      className = `${className} ${styles.requestingPermission}`;
    }
    return (this.props.downloadUrlFn) ?
      <a href={this.props.downloadUrlFn(this.state.selected)}>
        <button className={className}>{text}</button>
      </a>
      :
      <button onClick={this.handleClick} className={className}>{text}</button>;
  }

  updateDatatype = (datatype) => {
    this.setState({ selected: datatype });
  }

  renderMenuButtons = () => {
    return this.props.options.map((datatype) => {
      const fn = () => {
        this.updateDatatype(datatype);
      };
      const text = (this.props.requestFn) ? `Request ${datatype} access` : `Download .${datatype}`;
      return (
        <div className={styles.menuOption} key={datatype}>
          <button
              className={styles.menuOptionButton}
              onMouseDown={fn}
              onClick={fn}>{text}</button>
        </div>
      );
    });
  }

  expandButtonClass = () => {
    return (this.props.options.length > 1) ? styles.dropdownButton : styles.hidden;
  }

  dropdownClass = () => {
    if (!this.state.dropdownOpen) return styles.hidden;
    return (this.props.requestFn) ? `${styles.menuContainer} ${styles.requestingPermission}` : styles.menuContainer;
  }

  render() {
    const text = (this.props.requestFn) ? `Request ${this.state.selected} access` : `Download .${this.state.selected}`;
    return (
      <div className={styles.dropdownContainer}>
        <div className={styles.buttonContainer}>
          {this.renderDownloadButton(text)}
          <button onClick={this.openDropdown} className={this.expandButtonClass()}>v</button>
        </div>
        <div className={this.dropdownClass(this.state.dropdownOpen)}>
          {this.renderMenuButtons()}
        </div>
      </div>
    );
  }
}

export default DropdownButton;
