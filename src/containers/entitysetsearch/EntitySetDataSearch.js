import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Pagination } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Promise from 'bluebird';
import { AuthorizationApi, SearchApi, EntityDataModelApi } from 'loom-data';
import { Permission } from '../../core/permissions/Permission';
import Page from '../../components/page/Page';
import PropertyTypeFilter from './components/PropertyTypeFilter';
import EntitySetSearchBox from './EntitySetSearchBox';
import EntitySetSearchResults from './EntitySetSearchResults';
import EntitySetUserSearchResults from './EntitySetUserSearchResults';
import AsyncContent, { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import { FIRST_NAMES, LAST_NAMES, DOBS } from '../../utils/Consts/StringConsts';
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
      selectedPropertyTypes: [],
      loadError: false,
      hidePagination: false,
      personViewProps: [],
      searchView: ''
    };
  }

  componentDidMount() {
    const searchTerm = (this.props.location.query.searchTerm) ? this.props.location.query.searchTerm : '';
    const page = (this.props.location.query.page) ? this.props.location.query.page : 1
    this.loadPropertyTypeIds(searchTerm, page);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.location.key) {
      const searchTerm = (nextProps.location.query.searchTerm) ? nextProps.location.query.searchTerm : '';
      const page = (nextProps.location.query.page) ? nextProps.location.query.page : 1
      this.setState({
        searchTerm,
        page,
        searchResults: [],
        totalHits: 0,
        asyncStatus: (nextProps.location.query.searchTerm) ? ASYNC_STATUS.LOADING : ASYNC_STATUS.PENDING
      });
      if (nextProps.location.query.searchTerm) {
        this.executeSearch(searchTerm, page);
      }
    }
  }

  loadPropertyTypeIds = (searchTerm, page) => {
    EntityDataModelApi.getEntitySet(this.props.params.entitySetId)
    .then((entitySet) => {
      EntityDataModelApi.getEntityType(entitySet.entityTypeId)
      .then((entityType) => {
        this.loadPropertyTypes(entityType.properties, searchTerm, page, entitySet.title);
      }).catch(() => {
        this.setState({ loadError: true });
      });
    }).catch(() => {
      this.setState({ loadError: true });
    });
  }

  loadPropertyTypes = (propertyTypeIds, searchTerm, page, title) => {
    const accessChecks = [];
    propertyTypeIds.forEach((propertyId) => {
      if (propertyId !== 'id') {
        accessChecks.push({
          aclKey: [this.props.params.entitySetId, propertyId],
          permissions: [Permission.READ.name]
        });
      }
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
        let personViewProps = [];
        let searchView = views.TABLE;
        let firstName;
        let lastName;
        propertyTypes.forEach((propertyType) => {
          if (FIRST_NAMES.includes(propertyType.type.name.toLowerCase())) firstName = propertyType.id;
          else if (LAST_NAMES.includes(propertyType.type.name.toLowerCase())) lastName = propertyType.id;
        });
        if (firstName && lastName) {
          personViewProps = [firstName, lastName];
          searchView = views.PERSON;
        }
        this.setState({
          propertyTypes,
          selectedPropertyTypes: propertyTypes,
          title,
          loadError: false,
          personViewProps,
          searchView
        });
        if (searchTerm && searchTerm.length) {
          this.executeSearch(searchTerm, page);
        }
      }).catch(() => {
        this.setState({ loadError: true });
      });
    });
  }

  executeSearch = (searchTerm, page) => {
    const searchRequest = {
      searchTerm,
      start: ((page - 1) * MAX_HITS),
      maxHits: MAX_HITS
    };
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
    if (this.state.title.length <= 0) return '';
    return (
      <span>: <Link
          to={`/entitysets/${this.props.params.entitySetId}`}
          className={styles.titleLink}>{this.state.title}</Link></span>
    );
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

  personViewIsAvailable = () => {
    const foundIds = [];
    this.state.selectedPropertyTypes.forEach((propertyType) => {
      if (this.state.personViewProps.includes(propertyType.id)) foundIds.push(propertyType.id);
    });
    return (foundIds.length === this.state.personViewProps.length);
  }

  renderToggleSearchView = () => {
    if (this.state.searchResults.length && this.personViewIsAvailable()) {
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
    if (this.personViewIsAvailable() && this.state.searchView === views.PERSON) {
      let firstName;
      let lastName;
      let dob;
      let mugshot;
      this.state.selectedPropertyTypes.forEach((propertyType) => {
        if (FIRST_NAMES.includes(propertyType.type.name.toLowerCase())) firstName = propertyType;
        else if (LAST_NAMES.includes(propertyType.type.name.toLowerCase())) lastName = propertyType;
        else if (DOBS.includes(propertyType.type.name.toLowerCase())) dob = propertyType;
        else if (propertyType.type.name.toLowerCase() === 'mugshot') mugshot = propertyType;
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
            entitySetId={this.props.params.entitySetId}
            propertyTypes={this.state.selectedPropertyTypes}
            firstName={firstName}
            lastName={lastName}
            dob={dob}
            mugshot={mugshot}
            hidePaginationFn={this.hidePagination}
            formatValueFn={this.formatValue} />
      );
    }
    return (
      <EntitySetSearchResults
          results={this.state.searchResults}
          entitySetId={this.props.params.entitySetId}
          propertyTypes={this.state.selectedPropertyTypes}
          formatValueFn={this.formatValue} />
    );
  }

  renderPropertyTypeFilter = () => {
    return (
      <PropertyTypeFilter
          propertyTypes={this.state.propertyTypes}
          onListUpdate={(selectedPropertyTypes) => {
            const searchView = (this.personViewIsAvailable()) ? this.state.searchView : views.TABLE;
            this.setState({ selectedPropertyTypes, searchView });
          }} />
    );
  }

  render() {
    const title = (this.state.title && this.state.title.length) ? `Search: ${this.state.title}` : 'Search';
    return (
      <DocumentTitle title={title}>
        <Page>
          <Page.Header>
            <Page.Title>Search entity set{this.renderEntitySetTitle()}</Page.Title>
            <EntitySetSearchBox onSubmit={this.onSearchSubmit} initialSearch={this.props.location.query.searchTerm} />
            <Link to={`/advanced_search/${this.props.params.entitySetId}`} className={styles.changeSearchView}>
              Advanced Search
            </Link>
            {this.renderPropertyTypeFilter()}
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
      </DocumentTitle>
    );
  }


}
