import React, { PropTypes } from 'react';
import { FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';
import styles from '../securableobject/securableobject.module.css';

export default class EntitySetSearchBox extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    initialSearch: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: (props.initialSearch) ? props.initialSearch : ''
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
