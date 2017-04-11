import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Pagination } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Promise from 'bluebird';
import { AuthorizationApi, SearchApi, EntityDataModelApi } from 'loom-data';
import { Permission } from '../../core/permissions/Permission';
import Page from '../../components/page/Page';
import AdvancedSearchBox from './AdvancedSearchBox';
import EntitySetSearchResults from './EntitySetSearchResults';
import EntitySetUserSearchResults from './EntitySetUserSearchResults';
import AsyncContent, { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import styles from './styles.module.css';

const MAX_HITS = 50;

export default class AdvancedDataSearch extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    params: PropTypes.shape({
      entitySetId: PropTypes.string.isRequired
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      searchResults: [],
      totalHits: 0,
      title: '',
      asyncStatus: ASYNC_STATUS.PENDING,
      propertyTypes: [],
      loadError: false,
      hidePagination: false,
      searches: {}
    };
  }

  componentDidMount() {
    this.loadPropertyIds();
  }

  loadPropertyIds = () => {
    EntityDataModelApi.getEntitySet(this.props.params.entitySetId)
    .then((entitySet) => {
      EntityDataModelApi.getEntityType(entitySet.entityTypeId)
      .then((entityType) => {
        this.loadAuthorizedPropertyTypes(entitySet, entityType.properties);
      }).catch(() => {
        this.setState({ loadError: true });
      });
    }).catch(() => {
      this.setState({ loadError: true });
    });
  }

  loadAuthorizedPropertyTypes = (entitySet, propertyIds) => {
    const accessChecks = propertyIds.map((propertyId) => {
      return {
        aclKey: [this.props.params.entitySetId, propertyId],
        permissions: [Permission.READ.name]
      };
    });
    AuthorizationApi.checkAuthorizations(accessChecks)
    .then((response) => {
      const propsWithReadAccess = [];
      response.forEach((property) => {
        if (property.permissions.READ) {
          propsWithReadAccess.push(property.aclKey[1]);
        }
      });
      const propertyTypePromises = propsWithReadAccess.map((propId) => {
        return EntityDataModelApi.getPropertyType(propId);
      });
      Promise.all(propertyTypePromises)
      .then((propertyTypes) => {
        this.setState({
          propertyTypes,
          title: entitySet.title,
          loadError: false
        });
      }).catch(() => {
        this.setState({ loadError: true });
      });
    }).catch(() => {
      this.setState({ loadError: true });
    });
  }

  executeSearch = (searches, page) => {
    if (Object.keys(searches).length >= 1 && Object.values(searches).length >= 1) {
      const searchDetails = Object.values(searches).filter((search) => {
        return search.searchTerm && search.searchTerm.length;
      });
      const searchOptions = {
        searchFields: searchDetails,
        start: ((page - 1) * 50),
        maxHits: MAX_HITS
      };
      SearchApi.advancedSearchEntitySetData(this.props.params.entitySetId, searchOptions)
      .then((response) => {
        this.setState({
          searchResults: response.hits,
          totalHits: response.numHits,
          asyncStatus: ASYNC_STATUS.SUCCESS,
          searches,
          page
        });
      }).catch(() => {
        this.setState({ asyncStatus: ASYNC_STATUS.ERROR });
      });
    }
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
    this.setState({ page: eventKey });
    this.executeSearch(this.state.searches, eventKey);
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

  onSearchSubmit = (searches) => {
    this.executeSearch(searches, this.state.page);
    this.setState({ searches });
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

  renderSearchResultType = () => {
    let firstName;
    let lastName;
    let dob;
    this.state.propertyTypes.forEach((propertyType) => {
      if (propertyType.type.name.toLowerCase() === 'firstname') firstName = propertyType;
      else if (propertyType.type.name.toLowerCase() === 'lastname') lastName = propertyType;
      else if (propertyType.type.name.toLowerCase() === 'dob') dob = propertyType;
    });
    if (firstName && lastName) {
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

  renderSearchBox = () => {
    if (this.state.propertyTypes.length === 0) return null;
    return (
      <AdvancedSearchBox
          onSubmit={this.onSearchSubmit}
          propertyTypes={this.state.propertyTypes} />
    );
  }

  render() {
    const title = (this.state.title && this.state.title.length)
      ? `Advanced Search: ${this.state.title}`
      : 'Advanced Search';
    return (
      <DocumentTitle title={title}>
        <Page>
          <Page.Header>
            <Page.Title>Search entity set{this.renderEntitySetTitle()}</Page.Title>
            {this.renderSearchBox()}
            <Link to={`/search/${this.props.params.entitySetId}`} className={styles.changeSearchView}>
              Simple Search
            </Link>
          </Page.Header>
          <Page.Body>
            {this.renderErrorMessage()}
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
