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

  renderInputFields = () => {
    return (
      <div className={styles.inputsWrapper_4}>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label htmlFor="name">Name:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="name"
                type="text"
                value={this.state.name}
                onChange={this.handleNameChange}
                className={styles.inputBox} />
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label className={styles.inputBox} htmlFor="title">Title:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="title"
                type="text"
                value={this.state.title}
                onChange={this.handleTitleChange}
                className={styles.inputBox} />
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label className={styles.inputBox} htmlFor="description">Description:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="description"
                type="text"
                value={this.state.description}
                onChange={this.handleDescriptionChange}
                className={styles.inputBox} />
          </div>
        </div>
        <div className={styles.inputRow}>
          <div className={styles.col_1}>
            <label className={styles.inputBox} htmlFor="contact">Contact:</label>
          </div>
          <div className={styles.col_4}>
            <input
                id="contact"
                type="text"
                value={this.state.contact}
                onChange={this.handleContactChange}
                className={styles.inputBox} />
          </div>
        </div>
      </div>
    );
  }

  link = () => {
    const { name, title, description, contact } = this.state;
    if (name.length < 1 || title.length < 1) {
      this.setState({ noNameOrTitleError: true });
      // this.setState({
      //   noNameOrTitleError: true,
      //   isLoading: true
      // });
    }
    else {
      this.props.linkFn(name, title, description, [contact]);
      this.setState({ noNameOrTitleError: false });
    }
  }

  renderLinkButton = () => {
    return (<Button bsStyle="primary" onClick={this.link}>Create Entity Set</Button>);
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
        {this.renderInputFields()}
        {this.renderLinkButton()}
        {this.renderError()}
      </div>
    );
  }
}
