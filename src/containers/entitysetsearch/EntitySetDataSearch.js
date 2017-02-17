import React, { PropTypes } from 'react';
import { Pagination } from 'react-bootstrap';
import Promise from 'bluebird';
import { SearchApi, EntityDataModelApi } from 'loom-data';
import Page from '../../components/page/Page';
import EntitySetSearchBox from './EntitySetSearchBox';
import EntitySetSearchResults from './EntitySetSearchResults';
import AsyncContent, { ASYNC_STATUS } from '../../components/asynccontent/AsyncContent';
import styles from './styles.module.css';

const MAX_HITS = 50;

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
      loadError: false
    };
  }

  componentDidMount() {
    this.loadPropertyTypes(this.props.location.query.searchTerm);
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

  loadPropertyTypes = (searchTerm) => {
    EntityDataModelApi.getEntitySet(this.props.params.entitySetId)
    .then((entitySet) => {
      EntityDataModelApi.getEntityType(entitySet.entityTypeId)
      .then((entityType) => {
        Promise.map(entityType.properties, (propertyId) => {
          return EntityDataModelApi.getPropertyType(propertyId);
        }).then((propertyTypes) => {
          this.setState({
            propertyTypes,
            title: entitySet.title,
            loadError: false
          });
          if (searchTerm) {
            this.executeSearch(searchTerm);
          }
        }).catch(() => {
          this.setState({ loadError: true });
        });
      }).catch(() => {
        this.setState({ loadError: true });
      });
    }).catch(() => {
      this.setState({ loadError: true });
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

  renderPagination = () => {
    const activePage = parseInt(this.state.page, 10);
    if (this.state.totalHits <= 0 || isNaN(activePage)) return null;
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

  render() {
    return (
      <Page>
        <Page.Header>
          <Page.Title>Search entity set{this.renderEntitySetTitle()}</Page.Title>
          <EntitySetSearchBox onSubmit={this.onSearchSubmit} initialSearch={this.props.location.query.searchTerm} />
        </Page.Header>
        <Page.Body>
          {this.renderErrorMessage()}
          <AsyncContent
              status={this.state.asyncStatus}
              pendingContent={<h2>Please run a search</h2>}
              content={() => {
                return (<EntitySetSearchResults
                    results={this.state.searchResults}
                    propertyTypes={this.state.propertyTypes} />);
              }} />
          {this.renderPagination()}
          <div className={styles.bottomSpacer} />
        </Page.Body>
      </Page>
    );
  }


}
