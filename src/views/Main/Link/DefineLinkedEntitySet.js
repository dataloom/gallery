import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import styles from './styles.module.css';

export default class DefineLinkedEntitySet extends React.Component {
  static propTypes = {
    linkFn: PropTypes.func.isRequired,
    defaultContact: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      title: '',
      description: '',
      contact: props.defaultContact,
      noNameOrTitleError: false
    };
  }

  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  }

  handleTitleChange = (e) => {
    this.setState({ title: e.target.value });
  }

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  }

  handleContactChange = (e) => {
    this.setState({ contact: e.target.value });
  }

  renderNameField = () => {
    return (
      <div className={styles.inputRowSet}>
        <label className={styles.inputLabel} htmlFor="name">Name:</label>
        <input
            id="name"
            type="text"
            value={this.state.name}
            onChange={this.handleNameChange}
            className={styles.longInputBox} />
      </div>
    );
  }

  renderTitleField = () => {
    return (
      <div className={styles.inputRowSet}>
        <label className={styles.inputLabel} htmlFor="title">Title:</label>
        <input
            id="title"
            type="text"
            value={this.state.title}
            onChange={this.handleTitleChange}
            className={styles.longInputBox} />
      </div>
    );
  }

  renderDescriptionField = () => {
    return (
      <div className={styles.inputRowSet}>
        <label className={styles.inputLabel} htmlFor="description">Description:</label>
        <input
            id="description"
            type="text"
            value={this.state.description}
            onChange={this.handleDescriptionChange}
            className={styles.longInputBox} />
      </div>
    );
  }

  renderContactField = () => {
    return (
      <div className={styles.inputRowSet}>
        <label className={styles.inputLabel} htmlFor="contact">Contact:</label>
        <input
            id="contact"
            type="text"
            value={this.state.contact}
            onChange={this.handleContactChange}
            className={styles.longInputBox} />
      </div>
    );
  }

  link = () => {
    const { name, title, description, contact } = this.state;
    if (name.length < 1 || title.length < 1) {
      this.setState({ noNameOrTitleError: true });
    }
    else {
      this.props.linkFn(name, title, description, [contact]);
      this.setState({ noNameOrTitleError: false });
    }
  }

  renderLinkButton = () => {
    return (<Button bsStyle="primary" onClick={this.link}>Link</Button>);
  }

  renderError = () => {
    if (this.state.noNameOrTitleError) {
      return <div className={styles.error}>You must choose a name and title.</div>;
    }
    return null;
  }

  render() {
    return (
      <div className={styles.linkedDefinitionContainer}>
        <div className={styles.explanationText}>Step 4. Define your linked entity set.</div>
        {this.renderNameField()}
        <br />
        {this.renderTitleField()}
        <br />
        {this.renderDescriptionField()}
        <br />
        {this.renderContactField()}
        <br />
        {this.renderLinkButton()}
        {this.renderError()}
      </div>
    );
  }
}
