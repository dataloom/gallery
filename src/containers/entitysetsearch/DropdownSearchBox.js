import React, { PropTypes } from 'react';
import FontAwesome from 'react-fontawesome';
import PageConsts from '../../utils/Consts/PageConsts';
import styles from './styles.module.css';

const ENTER_KEY = 13;

export default class DropdownSearchBox extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

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
    if (e.keyCode === ENTER_KEY) {
      this.submitSearch();
    }
    else {
      this.setState({ searchTerm: e.target.value });
    }
  }

  handleClick = (e) => {
    e.nativeEvent.stopImmediatePropagation();
  }

  submitSearch = () => {
    this.context.router.push({
      pathname: `/${PageConsts.SEARCH}/${this.props.entitySetId}`,
      query: {
        page: 1,
        searchTerm: this.state.searchTerm
      }
    });
  }

  onKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.submitSearch();
    }
    else if (e.target.value) {
      this.setState({ searchTerm: e.target.value });
    }
  }

  render() {
    return (
      <div className={styles.searchWrapper}>
        <div onClick={this.submitSearch}>
          <FontAwesome name="search" className={styles.searchIcon} />
        </div>
        <input
            onClick={this.handleClick}
            onKeyUp={this.onKeyUp}
            className={styles.searchBox}
            type="text"
            placeholder="Search entity set" />
      </div>
    );
  }
}
