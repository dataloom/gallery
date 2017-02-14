import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import styles from './styles.module.css';

export default class DropdownSearchBox extends React.Component {

  static propTypes = {
    entitySetId: PropTypes.string
  }

  constructor() {
    super();
    this.state = {
      searchTerm: ''
    };
  }

  handleSearchTermChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  handleClick = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  render() {
    return (
      <div className={styles.searchWrapper}>
        <Link className={styles.hiddenLink} to={`/search/${this.props.entitySetId}?searchTerm=${this.state.searchTerm}`}>
          <FontAwesome name="search" className={styles.searchIcon} />
        </Link>
        <input
          onClick={this.handleClick}
          className={styles.searchBox}
          type="text"
          placeholder="Search entity set"
          onChange={this.handleSearchTermChange} />
      </div>
    );
  }
}
