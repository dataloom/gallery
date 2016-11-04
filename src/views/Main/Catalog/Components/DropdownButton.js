import React, { PropTypes } from 'react';
import styles from '../../../../styles/dropdownButton.module.css';

export class DropdownButton extends React.Component {
  static propTypes = {
    downloadFn: PropTypes.func,
    downloadUrlFn: PropTypes.func,
    downloadOptions: PropTypes.array
  }

  constructor(props) {
    super(props);
    this.state = {
      selected: props.downloadOptions[0],
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

  showDropdown = {
    true: styles.menuContainer,
    false: styles.hidden
  }

  handleDocumentClick = () => {
    if (this.mounted) {
      if (this.mouseDownOnComponent) return;
      this.setState({ dropdownOpen: false });
    }
  }

  download = () => {
    this.props.downloadFn(this.state.selected);
  }

  openDropdown = () => {
    this.setState({ dropdownOpen: true });
  }

  renderDownloadButton = (text) => {
    let className = styles.downloadButton;
    if (this.props.downloadOptions.length <= 1) {
      className = `${className} ${styles.singleOption}`;
    }
    return (this.props.downloadUrlFn) ?
      <a href={this.props.downloadUrlFn(this.state.selected)}>
        <button className={className}>{text}</button>
      </a>
      :
        <button onClick={this.download} className={className}>{text}</button>;
  }

  updateDatatype = (datatype) => {
    this.setState({ selected: datatype });
  }

  renderMenuButtons = () => {
    return this.props.downloadOptions.map((datatype) => {
      const fn = () => {
        this.updateDatatype(datatype);
      };
      return (
        <div className={styles.menuOption} key={datatype}>
          <button
            className={styles.menuOptionButton}
            onMouseDown={fn}
            onClick={fn}
          >{`Download .${datatype}`}</button>
        </div>
      );
    });
  }

  expandButtonClass = () => {
    return (this.props.downloadOptions.length > 1) ? styles.dropdownButton : styles.hidden;
  }

  render() {
    const text = `Download .${this.state.selected}`;
    return (
      <div className={styles.dropdownContainer}>
        <div className={styles.buttonContainer}>
          {this.renderDownloadButton(text)}
          <button onClick={this.openDropdown} className={this.expandButtonClass()}>v</button>
        </div>
        <div className={this.showDropdown[this.state.dropdownOpen]}>
          {this.renderMenuButtons()}
        </div>
      </div>
    );
  }
}

export default DropdownButton;
