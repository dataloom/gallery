import React, { PropTypes } from 'react';
import { FormGroup, InputGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import styles from '../securableobject/securableobject.module.css';

export default class EntitySetSearchBox extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = {
      searchTerm: ''
    };
  }

  onChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.searchTerm);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className={styles.search}>
        <FormGroup className={styles.keyword}>
          <ControlLabel>Keyword</ControlLabel>
          <InputGroup>
            <InputGroup.Addon><FontAwesome name="search" /></InputGroup.Addon>
            <FormControl
                value={this.state.searchTerm}
                type="text"
                onChange={this.onChange} />
          </InputGroup>
        </FormGroup>
        <Button type="submit" bsStyle="primary" className={styles.submitButton}>Search</Button>
      </form>
    );
  }

}
