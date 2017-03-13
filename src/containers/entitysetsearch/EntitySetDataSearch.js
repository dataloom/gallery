import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Pagination } from 'react-bootstrap';
import Promise from 'bluebird';
import { AuthorizationApi, SearchApi, EntityDataModelApi } from 'loom-data';
import { Permission } from '../../core/permissions/Permission';
import Page from '../../components/page/Page';
import EntitySetSearchBox from './EntitySetSearchBox';
import EntitySetSearchResults from './EntitySetSearchResults';
import EntitySetUserSearchResults from './EntitySetUserSearchResults';
import AsyncContent, { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import styles from './styles.module.css';

const MAX_HITS = 50;
const views = {
  PERSON: 'personView',
  TABLE: 'tableView'
};

export default class EntitySetDataSearch extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    params: PropTypes.shape({
      entitySetId: PropTypes.string.isRequired
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        searchTerm: PropTypes.string,
        page: PropTypes.string
      }),
      key: PropTypes.string
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: (props.location.query.searchTerm) ? props.location.query.searchTerm : '',
      page: (props.location.query.page) ? props.location.query.page : 1,
      searchResults: [],
      totalHits: 0,
      title: '',
      asyncStatus: (props.location.query.searchTerm) ? ASYNC_STATUS.LOADING : ASYNC_STATUS.PENDING,
      propertyTypes: [],
      loadError: false,
      hidePagination: false,
      personViewAvailable: false,
      searchView: ''
    };
  }

  componentDidMount() {
    this.loadPropertyTypeIds(this.props.location.query.searchTerm);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.location.key) {
      this.setState({
        searchTerm: (nextProps.location.query.searchTerm) ? nextProps.location.query.searchTerm : '',
        page: (nextProps.location.query.page) ? nextProps.location.query.page : 1,
        searchResults: [],
        totalHits: 0,
        asyncStatus: (nextProps.location.query.searchTerm) ? ASYNC_STATUS.LOADING : ASYNC_STATUS.PENDING
      });
      if (nextProps.location.query.searchTerm) {
        this.executeSearch(nextProps.location.query.searchTerm);
      }
    }
  }

  loadPropertyTypeIds = (searchTerm) => {
    EntityDataModelApi.getEntitySet(this.props.params.entitySetId)
    .then((entitySet) => {
      EntityDataModelApi.getEntityType(entitySet.entityTypeId)
      .then((entityType) => {
        this.loadPropertyTypes(entityType.properties, searchTerm, entitySet.title);
      }).catch(() => {
        this.setState({ loadError: true });
      });
    }).catch(() => {
      this.setState({ loadError: true });
    });
  }

  loadPropertyTypes = (propertyTypeIds, searchTerm, title) => {
    const accessChecks = propertyTypeIds.map((propertyId) => {
      return {
        aclKey: [this.props.params.entitySetId, propertyId],
        permissions: [Permission.READ.name]
      };
    });
    AuthorizationApi.checkAuthorizations(accessChecks)
    .then((aces) => {
      const authorizedPropertyTypeIds = [];
      aces.forEach((ace) => {
        if (ace.permissions.READ) {
          authorizedPropertyTypeIds.push(ace.aclKey[1]);
        }
      });
      Promise.map(authorizedPropertyTypeIds, (propertyId) => {
        return EntityDataModelApi.getPropertyType(propertyId);
      }).then((propertyTypes) => {
        let personViewAvailable = false;
        let searchView = views.TABLE;
        let firstName = false;
        let lastName = false;
        propertyTypes.forEach((propertyType) => {
          if (propertyType.type.name.toLowerCase() === 'firstname') firstName = true;
          else if (propertyType.type.name.toLowerCase() === 'lastname') lastName = true;
        });
        if (firstName && lastName) {
          personViewAvailable = true;
          searchView = views.PERSON;
        }
        this.setState({
          propertyTypes,
          title,
          loadError: false,
          personViewAvailable,
          searchView
        });
        if (searchTerm) {
          this.executeSearch(searchTerm);
        }
      }).catch(() => {
        this.setState({ loadError: true });
      });
    });
  }

  executeSearch = (searchTerm) => {
    const searchRequest = {
      searchTerm,
      start: ((this.state.page - 1) * 50),
      maxHits: MAX_HITS
    }
    SearchApi.searchEntitySetData(this.props.params.entitySetId, searchRequest)
    .then((response) => {
      this.setState({
        searchResults: response.hits,
        totalHits: response.numHits,
        asyncStatus: ASYNC_STATUS.SUCCESS
      });
    }).catch(() => {
      this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
    });
  }

  onSearchSubmit = (searchTerm) => {
    if (searchTerm.length >= 1) {
      this.routeToNewQueryParams(searchTerm, 1);
    }
  }

  routeToNewQueryParams = (searchTerm, page) => {
    const query = { searchTerm, page };
    const newLocation = Object.assign({}, this.props.location, { query });
    this.context.router.push(newLocation);
  }

  renderEntitySetTitle = () => {
    return (this.state.title.length > 0) ? `: ${this.state.title}` : '';
  }

  renderErrorMessage = () => {
    if (this.state.loadError) {
      return <div className={styles.error}>Unable to load entity set info.</div>;
    }
    return null;
  }

  handlePageSelect = (eventKey) => {
    this.routeToNewQueryParams(this.state.searchTerm, eventKey);
  }

  hidePagination = (shouldHide) => {
    this.setState({ hidePagination: shouldHide });
  }

  formatValue = (rawValue) => {
    if (rawValue instanceof Array) {
      let formattedValue = '';
      if (rawValue.length > 0) formattedValue = formattedValue.concat(rawValue[0]);
      if (rawValue.length > 1) {
        for (let i = 1; i < rawValue.length; i += 1) {
          formattedValue = formattedValue.concat(', ').concat(rawValue[i]);
        }
      }
      return formattedValue;
    }
    return rawValue;
  }

  renderPagination = () => {
    const activePage = parseInt(this.state.page, 10);
    if (this.state.hidePagination || this.state.totalHits <= 0 || isNaN(activePage)) return null;
    const numPages = Math.ceil((1.0 * this.state.totalHits) / MAX_HITS);
    return (
      <div className={styles.paginationWrapper}>
        <Pagination
            prev
            next
            ellipsis
            boundaryLinks
            items={numPages}
            maxButtons={5}
            activePage={activePage}
            onSelect={this.handlePageSelect} />
      </div>
    );
  }

  toggleView = (searchView) => {
    this.setState({ searchView });
  }

  renderToggleSearchView = () => {
    if (this.state.searchResults.length && this.state.personViewAvailable) {
      const personClass = (this.state.searchView === views.PERSON) ?
        `${styles.buttonStyle} ${styles.selectedButtonStyle}` : styles.buttonStyle;
      const tableClass = (this.state.searchView === views.TABLE) ?
        `${styles.buttonStyle} ${styles.selectedButtonStyle}` : styles.buttonStyle;
      return (
        <div className={styles.searchToggle}>
          <button
              className={personClass}
              onClick={() => {
                this.toggleView(views.PERSON);
              }}>Person View</button>
          <button
              className={tableClass}
              onClick={() => {
                this.toggleView(views.TABLE);
              }}>Table View</button>
        </div>
      );
    }
    return null;
  }

  renderSearchResultType = () => {
    if (this.state.personViewAvailable && this.state.searchView === views.PERSON) {
      let firstName;
      let lastName;
      let dob;
      this.state.propertyTypes.forEach((propertyType) => {
        if (propertyType.type.name.toLowerCase() === 'firstname') firstName = propertyType;
        else if (propertyType.type.name.toLowerCase() === 'lastname') lastName = propertyType;
        else if (propertyType.type.name.toLowerCase() === 'dob') dob = propertyType;
      });
      let view = this.state.searchView;
      if (!view.length) {
        if (firstName && lastName) {
          this.setState({ searchView: views.PERSON });
          view = views.PERSON;
        }
        else {
          this.setState({ searchView: views.TABLE });
          view = views.TABLE;
        }
      }
      return (
        <EntitySetUserSearchResults
            results={this.state.searchResults}
            propertyTypes={this.state.propertyTypes}
            firstName={firstName}
            lastName={lastName}
            dob={dob}
            hidePaginationFn={this.hidePagination}
            formatValueFn={this.formatValue} />
      );
    }
    return (
      <EntitySetSearchResults
          results={this.state.searchResults}
          propertyTypes={this.state.propertyTypes}
          formatValueFn={this.formatValue} />
    );
  }

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Search entity set{this.renderEntitySetTitle()}</Page.Title>
          <EntitySetSearchBox onSubmit={this.onSearchSubmit} initialSearch={this.props.location.query.searchTerm} />
          <Link to={`/advanced_search/${this.props.params.entitySetId}`} className={styles.changeSearchView}>Advanced Search</Link>
        </Page.Header>
        <Page.Body>
          {this.renderErrorMessage()}
          {this.renderToggleSearchView()}
          <AsyncContent
              status={this.state.asyncStatus}
              pendingContent={<h2>Please run a search</h2>}
              content={this.renderSearchResultType} />
          {this.renderPagination()}
          <div className={styles.bottomSpacer} />
        </Page.Body>
      </Page>
    );
  }


}
